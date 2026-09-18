# Tu Tiên: Vấn Đạo

Prototype game tu tiên dạng web/idle RPG, viết bằng HTML + CSS + JavaScript thuần.

## Có gì trong bản 0.1.0

- Tu luyện: thổ nạp, vận công, tích lũy tu vi.
- Hệ thống cảnh giới từ Luyện Khí đến Nguyên Anh sơ kỳ.
- Đột phá có xác suất thành công/thất bại.
- Phá cảnh đan giúp tăng xác suất đột phá.
- Hạ sơn lịch luyện: nhặt linh thạch, linh thảo, ngộ đạo hoặc gặp yêu thú.
- Combat theo lượt, chí mạng theo thần thức, có rút lui.
- Luyện đan bằng tài nguyên thu thập được.
- Tự động lưu tiến độ bằng `localStorage`.
- Giao diện responsive desktop/mobile.
- Asset SVG gốc nằm trong `public/img/`.

## Chạy game

Không cần build.

```bash
python3 -m http.server 8080
```

Sau đó mở:

```text
http://localhost:8080
```

Hoặc:

```bash
npm run start
```

## Cấu trúc

```text
.
├── index.html
├── package.json
├── public/
│   └── img/
├── src/
│   ├── game/
│   │   ├── actions.js
│   │   ├── data.js
│   │   └── state.js
│   ├── ui/
│   │   └── render.js
│   ├── main.js
│   └── styles.css
└── README.md
```

## Hướng phát triển tiếp

- Trang bị/pháp bảo và phẩm chất vật phẩm.
- Công pháp, linh căn, thuộc tính ngũ hành.
- Tông môn, nhiệm vụ, bí cảnh, boss.
- Auto battle / idle offline reward.
- Bản đồ nhiều khu vực.
- Âm thanh, hiệu ứng kiếm khí, particle.
- Backend tài khoản/cloud save.
