import os
import shutil
import tempfile
import time
import zipfile

import matplotlib
matplotlib.use("svg")  # Windows Application Control policy blocks the native agg backend DLL

import cv2
import gradio as gr
import numpy as np
from ultralytics import YOLO

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "best.pt")
model = YOLO(MODEL_PATH)


# ---------- yordamchi funksiyalar ----------

def draw_boxes(img_bgr, boxes, pending_points=None):
    h, w = img_bgr.shape[:2]
    vis = img_bgr.copy()
    for i, (xc, yc, bw, bh) in enumerate(boxes):
        x1, y1 = int((xc - bw / 2) * w), int((yc - bh / 2) * h)
        x2, y2 = int((xc + bw / 2) * w), int((yc + bh / 2) * h)
        cv2.rectangle(vis, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(vis, str(i), (x1, max(y1 - 8, 12)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    for p in pending_points or []:
        cv2.drawMarker(vis, p, (255, 60, 60), markerType=cv2.MARKER_CROSS, markerSize=20, thickness=2)
    if pending_points and len(pending_points) == 2:
        cv2.rectangle(vis, pending_points[0], pending_points[1], (255, 60, 60), 2)
    return vis


def render_frame(frames, idx):
    if not frames:
        return None, gr.update(choices=[], value=[]), "Frame yo'q", 0
    idx = max(0, min(idx, len(frames) - 1))
    rec = frames[idx]
    img = cv2.imread(rec["raw_path"])
    vis = draw_boxes(img, rec["boxes"])
    vis_rgb = cv2.cvtColor(vis, cv2.COLOR_BGR2RGB)
    choices = [f"Box {i}" for i in range(len(rec["boxes"]))]
    label = f"Frame {idx + 1}/{len(frames)} — split: {rec['split']} — aniqlangan: {len(rec['boxes'])} ta odam"
    return vis_rgb, gr.update(choices=choices, value=[]), label, idx


def _refresh(frames, idx, pending=None, msg=""):
    vis_rgb, choices_update, label, idx = render_frame(frames, idx)
    return frames, vis_rgb, choices_update, label, idx, (pending or []), msg


# ---------- 1-bosqich: frame ajratish + auto-label ----------

def generate_frames(video_paths, frame_interval, conf, train_ratio, valid_ratio, progress=gr.Progress()):
    if not video_paths:
        raise gr.Error("Avval video(lar) yuklang.")

    video_paths = video_paths if isinstance(video_paths, list) else [video_paths]

    frame_interval = max(1, int(frame_interval))
    train_ratio = float(train_ratio)
    valid_ratio = float(valid_ratio)
    if train_ratio + valid_ratio >= 1.0:
        raise gr.Error("Train + valid nisbati 1 dan kichik bo'lishi kerak (test uchun joy qoldiring).")

    work_dir = tempfile.mkdtemp(prefix="bogcha_ds_")
    raw_dir = os.path.join(work_dir, "_raw_frames")
    os.makedirs(raw_dir, exist_ok=True)

    n_videos = len(video_paths)
    raw_records = []  # (raw_path, split) — har bir video o'zining ketma-ket bo'linishi bilan
    total_counts = {"train": 0, "valid": 0, "test": 0}

    for v_idx, video_path in enumerate(video_paths):
        cap = cv2.VideoCapture(video_path)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        print(f"[generate_frames] video {v_idx + 1}/{n_videos}: {video_path} total={total} {w}x{h}", flush=True)
        raw_paths = []
        i = 0
        t0 = time.time()
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            if i % frame_interval == 0:
                fpath = os.path.join(raw_dir, f"v{v_idx:02d}_frame_{len(raw_paths):05d}.jpg")
                cv2.imwrite(fpath, frame)
                raw_paths.append(fpath)
            i += 1
            if i % 100 == 0:
                print(f"[generate_frames] video {v_idx + 1}/{n_videos}: read {i}/{total} frames ({time.time() - t0:.1f}s elapsed)", flush=True)
            if total:
                video_frac = min(i / total, 1.0)
                progress((v_idx + video_frac) / n_videos * 0.5, desc=f"Frame ajratilmoqda... (video {v_idx + 1}/{n_videos})")
        cap.release()
        print(f"[generate_frames] video {v_idx + 1}/{n_videos}: extraction done, {len(raw_paths)} frames kept in {time.time() - t0:.1f}s", flush=True)

        n = len(raw_paths)
        if n == 0:
            continue

        n_train = int(n * train_ratio)
        n_valid = int(n * valid_ratio)
        split_assign = ["train"] * n_train + ["valid"] * n_valid + ["test"] * (n - n_train - n_valid)
        total_counts["train"] += n_train
        total_counts["valid"] += n_valid
        total_counts["test"] += n - n_train - n_valid
        raw_records.extend(zip(raw_paths, split_assign))

    n = len(raw_records)
    if n == 0:
        raise gr.Error("Videolardan frame olinmadi.")

    print(f"[generate_frames] auto-label boshlanmoqda: {n} ta frame", flush=True)
    t0 = time.time()
    frames = []
    for idx, (fpath, split) in enumerate(raw_records):
        img = cv2.imread(fpath)
        results = model.predict(img, conf=conf, verbose=False)
        xywhn = results[0].boxes.xywhn.cpu().numpy().tolist()
        frames.append({"raw_path": fpath, "split": split, "boxes": xywhn})
        progress(0.5 + (idx / n) * 0.5, desc="Auto-label qilinmoqda...")
        if (idx + 1) % 20 == 0 or idx + 1 == n:
            print(f"[generate_frames] auto-label {idx + 1}/{n} ({time.time() - t0:.1f}s elapsed)", flush=True)

    vis_rgb, choices_update, label, idx = render_frame(frames, 0)
    status = (
        f"{n_videos} ta video'dan {n} ta frame tayyor "
        f"(train={total_counts['train']}, valid={total_counts['valid']}, test={total_counts['test']}). Ko'rib chiqing."
    )
    return frames, work_dir, vis_rgb, choices_update, label, 0, [], status


# ---------- 2-bosqich: ko'rib chiqish / tahrirlash ----------

def on_image_select(frames, idx, pending, evt: gr.SelectData):
    if not frames:
        raise gr.Error("Avval frame ajrating.")
    idx = max(0, min(idx, len(frames) - 1))
    pending = list(pending or [])
    pending.append((evt.index[0], evt.index[1]))
    pending = pending[-2:]

    rec = frames[idx]
    img = cv2.imread(rec["raw_path"])
    vis = draw_boxes(img, rec["boxes"], pending_points=pending)
    vis_rgb = cv2.cvtColor(vis, cv2.COLOR_BGR2RGB)
    msg = "Ikkinchi nuqtani (pastki-o'ng) bosing." if len(pending) == 1 else "Endi 'Yangi box qo'shish' tugmasini bosing."
    return vis_rgb, pending, msg


def add_box(frames, idx, pending):
    if not frames:
        raise gr.Error("Avval frame ajrating.")
    if not pending or len(pending) != 2:
        raise gr.Error("Avval rasmda ikkita nuqta bosing (yuqori-chap, keyin pastki-o'ng).")
    idx = max(0, min(idx, len(frames) - 1))
    rec = frames[idx]
    img = cv2.imread(rec["raw_path"])
    h, w = img.shape[:2]
    (x1, y1), (x2, y2) = pending
    left, right = sorted((x1, x2))
    top, bottom = sorted((y1, y2))
    if right - left < 5 or bottom - top < 5:
        raise gr.Error("Tanlangan hudud juda kichik.")

    xc, yc = (left + right) / 2 / w, (top + bottom) / 2 / h
    bw, bh = (right - left) / w, (bottom - top) / h
    rec["boxes"].append([xc, yc, bw, bh])
    return _refresh(frames, idx, [], "Yangi box qo'shildi.")


def delete_boxes(frames, idx, selected):
    if not frames:
        raise gr.Error("Avval frame ajrating.")
    idx = max(0, min(idx, len(frames) - 1))
    rec = frames[idx]
    if selected:
        for i in sorted((int(s.split()[1]) for s in selected), reverse=True):
            if 0 <= i < len(rec["boxes"]):
                rec["boxes"].pop(i)
    return _refresh(frames, idx, [], "Tanlangan box(lar) o'chirildi.")


def delete_frame(frames, idx):
    if not frames:
        raise gr.Error("Avval frame ajrating.")
    idx = max(0, min(idx, len(frames) - 1))
    frames.pop(idx)
    idx = max(0, min(idx, len(frames) - 1))
    return _refresh(frames, idx, [], "Frame butunlay o'chirildi.")


def go_prev(frames, idx):
    if not frames:
        raise gr.Error("Avval frame ajrating.")
    return _refresh(frames, max(0, idx - 1), [], "")


def go_next(frames, idx):
    if not frames:
        raise gr.Error("Avval frame ajrating.")
    return _refresh(frames, min(len(frames) - 1, idx + 1), [], "")


# ---------- 3-bosqich: eksport ----------

def export_zip(frames, work_dir):
    if not frames:
        raise gr.Error("Avval video yuklab, frame ajrating va ko'rib chiqing.")

    dataset_dir = os.path.join(work_dir, "video_dataset")
    if os.path.exists(dataset_dir):
        shutil.rmtree(dataset_dir)
    for split in ("train", "valid", "test"):
        os.makedirs(os.path.join(dataset_dir, split, "images"), exist_ok=True)
        os.makedirs(os.path.join(dataset_dir, split, "labels"), exist_ok=True)

    counts = {"train": 0, "valid": 0, "test": 0}
    frames_with_person = 0
    total_boxes = 0

    for rec in frames:
        split = rec["split"]
        fname = os.path.basename(rec["raw_path"])
        stem = os.path.splitext(fname)[0]
        shutil.copy(rec["raw_path"], os.path.join(dataset_dir, split, "images", fname))

        lines = [f"0 {xc:.6f} {yc:.6f} {bw:.6f} {bh:.6f}" for xc, yc, bw, bh in rec["boxes"]]
        if lines:
            frames_with_person += 1
            total_boxes += len(lines)
        with open(os.path.join(dataset_dir, split, "labels", f"{stem}.txt"), "w") as f:
            f.write("\n".join(lines))
        counts[split] += 1

    with open(os.path.join(dataset_dir, "data.yaml"), "w") as f:
        f.write(
            f"path: {dataset_dir}\n"
            "train: train/images\n"
            "val: valid/images\n"
            "test: test/images\n\n"
            "nc: 1\n"
            "names: ['person']\n"
        )

    zip_path = os.path.join(work_dir, "video_dataset.zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(dataset_dir):
            for file in files:
                full = os.path.join(root, file)
                zf.write(full, os.path.relpath(full, work_dir))

    status = (
        f"Jami: {len(frames)} (train={counts['train']}, valid={counts['valid']}, test={counts['test']})\n"
        f"Odam bor frame: {frames_with_person}\n"
        f"Jami box: {total_boxes}"
    )
    return zip_path, status


# ---------- UI ----------

with gr.Blocks(title="Bogcha — Video'dan dataset yaratish") as demo:
    frames_state = gr.State([])
    idx_state = gr.State(0)
    pending_state = gr.State([])
    workdir_state = gr.State("")

    gr.Markdown("## 1) Video'dan frame ajratish va avtomatik label qo'yish")
    gr.Markdown(
        "Bir yoki bir nechta video yuklang — belgilangan intervalda frame'lar ajratiladi, hozirgi model bilan "
        "avtomatik `person` label qo'yiladi. Har bir video o'zining ichida **ketma-ket** (video vaqti bo'yicha) "
        "train/valid/test'ga bo'linadi, tasodifiy emas."
    )
    with gr.Row():
        video_in = gr.File(label="Video(lar) yuklang", file_types=["video"], file_count="multiple")
        with gr.Column():
            interval_slider = gr.Slider(1, 60, value=15, step=1, label="Har necha frame'da bittasini olish")
            conf_slider = gr.Slider(0.05, 0.9, value=0.25, step=0.05, label="Auto-label ishonch chegarasi")
            train_ratio_slider = gr.Slider(0.5, 0.9, value=0.7, step=0.05, label="Train nisbati")
            valid_ratio_slider = gr.Slider(0.05, 0.3, value=0.2, step=0.05, label="Valid nisbati (qolgani test'ga ketadi)")
            generate_btn = gr.Button("Frame ajratish va auto-label", variant="primary")

    gr.Markdown("## 2) Ko'rib chiqish va tuzatish")
    gr.Markdown(
        "Rasmda ustiga bosib (avval yuqori-chap, keyin pastki-o'ng burchak) yangi box chizasiz. "
        "Ro'yxatdan xato box(lar)ni belgilab o'chirasiz. Butunlay noto'g'ri frame'ni ham o'chirib tashlash mumkin."
    )
    with gr.Row():
        with gr.Column(scale=2):
            review_img = gr.Image(label="Joriy frame", interactive=False)
            frame_label = gr.Textbox(label="Holat", interactive=False)
            with gr.Row():
                prev_btn = gr.Button("◀ Oldingi")
                next_btn = gr.Button("Keyingi ▶")
        with gr.Column(scale=1):
            box_checkboxes = gr.CheckboxGroup(label="Box'lar (o'chirish uchun tanlang)", choices=[])
            delete_boxes_btn = gr.Button("Tanlangan box(lar)ni o'chirish")
            add_box_btn = gr.Button("Yangi box qo'shish (2 nuqta bosgandan keyin)")
            delete_frame_btn = gr.Button("Bu frameni butunlay o'chirish", variant="stop")
            edit_status = gr.Textbox(label="Amal natijasi", interactive=False)

    gr.Markdown("## 3) Yakunlash")
    with gr.Row():
        export_btn = gr.Button("Zip qilib yuklab olish", variant="primary")
        zip_out = gr.File(label="Tayyor dataset (zip)")
    export_status = gr.Textbox(label="Statistika", lines=4)

    generate_btn.click(
        fn=generate_frames,
        inputs=[video_in, interval_slider, conf_slider, train_ratio_slider, valid_ratio_slider],
        outputs=[frames_state, workdir_state, review_img, box_checkboxes, frame_label, idx_state, pending_state, edit_status],
    )

    review_img.select(
        fn=on_image_select,
        inputs=[frames_state, idx_state, pending_state],
        outputs=[review_img, pending_state, edit_status],
    )

    add_box_btn.click(
        fn=add_box,
        inputs=[frames_state, idx_state, pending_state],
        outputs=[frames_state, review_img, box_checkboxes, frame_label, idx_state, pending_state, edit_status],
    )
    delete_boxes_btn.click(
        fn=delete_boxes,
        inputs=[frames_state, idx_state, box_checkboxes],
        outputs=[frames_state, review_img, box_checkboxes, frame_label, idx_state, pending_state, edit_status],
    )
    delete_frame_btn.click(
        fn=delete_frame,
        inputs=[frames_state, idx_state],
        outputs=[frames_state, review_img, box_checkboxes, frame_label, idx_state, pending_state, edit_status],
    )
    prev_btn.click(
        fn=go_prev,
        inputs=[frames_state, idx_state],
        outputs=[frames_state, review_img, box_checkboxes, frame_label, idx_state, pending_state, edit_status],
    )
    next_btn.click(
        fn=go_next,
        inputs=[frames_state, idx_state],
        outputs=[frames_state, review_img, box_checkboxes, frame_label, idx_state, pending_state, edit_status],
    )

    export_btn.click(
        fn=export_zip,
        inputs=[frames_state, workdir_state],
        outputs=[zip_out, export_status],
    )


if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7862)
