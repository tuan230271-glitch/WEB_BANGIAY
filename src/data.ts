import { Product, Review, CategoryItem, BrandItem, Promotion, BannerItem, Order, ContactMessage } from './types';

// Let's use the precise generated image paths for the main assets
export const PRODUCTS: Product[] = [
  {
    "id": "nike-air-max-pulse",
    "sku": "NK-AMP-01",
    "name": "Nike Air Max Pulse",
    "brand": "Nike",
    "category": "Sneaker",
    "gender": "Nam",
    "price": 4200000,
    "originalPrice": 4800000,
    "image": "/src/assets/images/shoes/nike-air-max-pulse.jpg",
    "images": [
      "/src/assets/images/shoes/nike-air-max-pulse.jpg",
      "/src/assets/images/shoes/nike-air-max-pulse-2.jpg",
      "/src/assets/images/shoes/nike-air-max-pulse-3.jpg",
      "/src/assets/images/shoes/nike-air-max-pulse-4.jpg",
      "/src/assets/images/shoes/nike-air-max-pulse-5.jpg",
      "/src/assets/images/shoes/nike-air-max-pulse-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 142,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 5,
      "40": 12,
      "41": 18,
      "42": 15,
      "43": 8,
      "44": 4
    },
    "stockQuantity": 62,
    "colors": [
      {
        "name": "Neon Orange",
        "hex": "#FF5400",
        "image": "/src/assets/images/shoes/nike-air-max-pulse.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-max-pulse.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-2.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-3.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-4.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-5.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-6.jpg"
        ]
      },
      {
        "name": "Slate Grey",
        "hex": "#64748B",
        "image": "/src/assets/images/shoes/nike-air-max-pulse-grey.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-max-pulse-grey.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-grey-2.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-grey-3.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-grey-4.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-grey-5.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-grey-6.jpg"
        ]
      },
      {
        "name": "Midnight Black",
        "hex": "#0F172A",
        "image": "/src/assets/images/shoes/nike-air-max-pulse-black.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-max-pulse-black.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-black-2.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-black-3.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-black-4.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-black-5.jpg",
          "/src/assets/images/shoes/nike-air-max-pulse-black-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đệm khí Air cải tiến vượt trội, đàn hồi và phong cách.",
    "description": "Lấy cảm hứng từ bối cảnh âm nhạc London, Nike Air Max Pulse mang đến một nét phá cách đầy cá tính cho dòng Air Max mang tính biểu tượng. Phần đệm khí Air được cải tiến vượt trội mang lại độ đàn hồi cực tốt, giúp bạn tự tin sải bước suốt cả ngày dài.",
    "status": "Đang bán",
    "createdAt": "15/01/2026"
  },
  {
    "id": "nike-air-force-1-07",
    "sku": "NK-AF1-02",
    "name": "Nike Air Force 1 '07 All White",
    "brand": "Nike",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2950000,
    "originalPrice": 3200000,
    "image": "/src/assets/images/shoes/nike-air-force-1-07.jpg",
    "images": [
      "/src/assets/images/shoes/nike-air-force-1-07.jpg",
      "/src/assets/images/shoes/nike-air-force-1-07-2.jpg",
      "/src/assets/images/shoes/nike-air-force-1-07-3.jpg",
      "/src/assets/images/shoes/nike-air-force-1-07-4.jpg",
      "/src/assets/images/shoes/nike-air-force-1-07-5.jpg",
      "/src/assets/images/shoes/nike-air-force-1-07-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 380,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "36": 6,
      "37": 8,
      "38": 10,
      "39": 15,
      "40": 20,
      "41": 25,
      "42": 20,
      "43": 12,
      "44": 8
    },
    "stockQuantity": 124,
    "colors": [
      {
        "name": "Triple White",
        "hex": "#FFFFFF",
        "image": "/src/assets/images/shoes/nike-air-force-1-07.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-force-1-07.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-2.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-3.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-4.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-5.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-6.jpg"
        ]
      },
      {
        "name": "Classic Black",
        "hex": "#111111",
        "image": "/src/assets/images/shoes/nike-air-force-1-07-black.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-force-1-07-black.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-black-2.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-black-3.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-black-4.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-black-5.jpg",
          "/src/assets/images/shoes/nike-air-force-1-07-black-6.jpg"
        ]
      }
    ],
    "shortDescription": "Huyền thoại đường phố với sắc trắng tinh khôi bất tử.",
    "description": "Huyền thoại sống của làng sneaker thế giới. Thiết kế da cao cấp bền bỉ, đệm Air-Sole êm ái cùng form dáng chuẩn mực giúp Air Force 1 trở thành đôi giày phải có trong mọi tủ đồ.",
    "status": "Đang bán",
    "createdAt": "10/01/2026"
  },
  {
    "id": "nike-dunk-low-panda",
    "sku": "NK-DUNK-03",
    "name": "Nike Dunk Low Retro 'Panda'",
    "brand": "Nike",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 3200000,
    "originalPrice": 3600000,
    "image": "/src/assets/images/shoes/nike-dunk-low-panda.jpg",
    "images": [
      "/src/assets/images/shoes/nike-dunk-low-panda.jpg",
      "/src/assets/images/shoes/nike-dunk-low-panda-2.jpg",
      "/src/assets/images/shoes/nike-dunk-low-panda-3.jpg",
      "/src/assets/images/shoes/nike-dunk-low-panda-4.jpg",
      "/src/assets/images/shoes/nike-dunk-low-panda-5.jpg",
      "/src/assets/images/shoes/nike-dunk-low-panda-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 420,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "38": 4,
      "39": 10,
      "40": 15,
      "41": 20,
      "42": 12,
      "43": 5
    },
    "stockQuantity": 66,
    "colors": [
      {
        "name": "Black / White",
        "hex": "#1F2937",
        "image": "/src/assets/images/shoes/nike-dunk-low-panda.jpg",
        "images": [
          "/src/assets/images/shoes/nike-dunk-low-panda.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-2.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-3.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-4.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-5.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-6.jpg"
        ]
      },
      {
        "name": "University Blue / White",
        "hex": "#2563EB",
        "image": "/src/assets/images/shoes/nike-dunk-low-panda-blue.jpg",
        "images": [
          "/src/assets/images/shoes/nike-dunk-low-panda-blue.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-blue-2.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-blue-3.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-blue-4.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-blue-5.jpg",
          "/src/assets/images/shoes/nike-dunk-low-panda-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Phối màu đen trắng kinh điển gây sốt toàn cầu.",
    "description": "Được tạo ra cho sàn đấu bóng rổ và được đón nhận bởi văn hóa ván trượt, Nike Dunk Low Retro Panda sở hữu hai gam màu đen trắng tương phản sắc sảo, phối đồ cực kỳ cuốn hút.",
    "status": "Đang bán",
    "createdAt": "12/01/2026"
  },
  {
    "id": "nike-air-jordan-1-low",
    "sku": "NK-AJ1L-04",
    "name": "Nike Air Jordan 1 Low 'Bred Toe'",
    "brand": "Nike",
    "category": "Sneaker",
    "gender": "Nam",
    "price": 3850000,
    "image": "/src/assets/images/shoes/nike-air-jordan-1-low.jpg",
    "images": [
      "/src/assets/images/shoes/nike-air-jordan-1-low.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-low-2.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-low-3.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-low-4.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-low-5.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-low-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 195,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 5,
      "40": 8,
      "41": 14,
      "42": 10,
      "43": 6,
      "44": 3
    },
    "stockQuantity": 46,
    "colors": [
      {
        "name": "Bred Toe (Đỏ/Đen/Trắng)",
        "hex": "#DC2626",
        "image": "/src/assets/images/shoes/nike-air-jordan-1-low.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-jordan-1-low.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-2.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-3.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-4.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-5.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-6.jpg"
        ]
      },
      {
        "name": "Royal Blue Toe",
        "hex": "#2563EB",
        "image": "/src/assets/images/shoes/nike-air-jordan-1-low-royal.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-jordan-1-low-royal.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-royal-2.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-royal-3.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-royal-4.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-royal-5.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-low-royal-6.jpg"
        ]
      }
    ],
    "shortDescription": "Bản sắc bóng rổ Jordan huyền thoại trong thiết kế cổ thấp năng động.",
    "description": "Lấy cảm hứng từ mẫu nguyên bản năm 1985, Air Jordan 1 Low mang phong cách cổ điển, gọn gàng và quen thuộc nhưng luôn tươi mới, sẵn sàng cùng bạn sải bước phong cách.",
    "status": "Đang bán",
    "createdAt": "18/01/2026"
  },
  {
    "id": "nike-air-jordan-1-mid",
    "sku": "NK-AJ1M-05",
    "name": "Nike Air Jordan 1 Mid 'Smoke Grey'",
    "brand": "Nike",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 4100000,
    "originalPrice": 4500000,
    "image": "/src/assets/images/shoes/nike-air-jordan-1-mid.jpg",
    "images": [
      "/src/assets/images/shoes/nike-air-jordan-1-mid.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-mid-2.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-mid-3.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-mid-4.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-mid-5.jpg",
      "/src/assets/images/shoes/nike-air-jordan-1-mid-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 112,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 4,
      "40": 6,
      "41": 10,
      "42": 8,
      "43": 4
    },
    "stockQuantity": 32,
    "colors": [
      {
        "name": "Light Smoke Grey",
        "hex": "#9CA3AF",
        "image": "/src/assets/images/shoes/nike-air-jordan-1-mid.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-jordan-1-mid.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-2.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-3.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-4.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-5.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-6.jpg"
        ]
      },
      {
        "name": "Shadow Black",
        "hex": "#111827",
        "image": "/src/assets/images/shoes/nike-air-jordan-1-mid-black.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-jordan-1-mid-black.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-black-2.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-black-3.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-black-4.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-black-5.jpg",
          "/src/assets/images/shoes/nike-air-jordan-1-mid-black-6.jpg"
        ]
      }
    ],
    "shortDescription": "Thiết kế cổ lửng thanh lịch với tông màu xám khói sang trọng.",
    "description": "Phiên bản Jordan 1 Mid phối màu Smoke Grey trung tính cực kỳ dễ mặc đồ, chất liệu da êm mịn ôm gọn cổ chân vừa bảo vệ vừa tôn dáng trang phục.",
    "status": "Đang bán",
    "createdAt": "20/01/2026"
  },
  {
    "id": "nike-air-max-90",
    "sku": "NK-AM90-06",
    "name": "Nike Air Max 90 'Infrared'",
    "brand": "Nike",
    "category": "Sneaker",
    "gender": "Nam",
    "price": 3500000,
    "originalPrice": 3900000,
    "image": "/src/assets/images/shoes/nike-air-max-90.jpg",
    "images": [
      "/src/assets/images/shoes/nike-air-max-90.jpg",
      "/src/assets/images/shoes/nike-air-max-90-2.jpg",
      "/src/assets/images/shoes/nike-air-max-90-3.jpg",
      "/src/assets/images/shoes/nike-air-max-90-4.jpg",
      "/src/assets/images/shoes/nike-air-max-90-5.jpg",
      "/src/assets/images/shoes/nike-air-max-90-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 168,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 6,
      "40": 10,
      "41": 15,
      "42": 12,
      "43": 7,
      "44": 3
    },
    "stockQuantity": 53,
    "colors": [
      {
        "name": "Infrared Red",
        "hex": "#EF4444",
        "image": "/src/assets/images/shoes/nike-air-max-90.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-max-90.jpg",
          "/src/assets/images/shoes/nike-air-max-90-2.jpg",
          "/src/assets/images/shoes/nike-air-max-90-3.jpg",
          "/src/assets/images/shoes/nike-air-max-90-4.jpg",
          "/src/assets/images/shoes/nike-air-max-90-5.jpg",
          "/src/assets/images/shoes/nike-air-max-90-6.jpg"
        ]
      },
      {
        "name": "Cool Grey",
        "hex": "#6B7280",
        "image": "/src/assets/images/shoes/nike-air-max-90-grey.jpg",
        "images": [
          "/src/assets/images/shoes/nike-air-max-90-grey.jpg",
          "/src/assets/images/shoes/nike-air-max-90-grey-2.jpg",
          "/src/assets/images/shoes/nike-air-max-90-grey-3.jpg",
          "/src/assets/images/shoes/nike-air-max-90-grey-4.jpg",
          "/src/assets/images/shoes/nike-air-max-90-grey-5.jpg",
          "/src/assets/images/shoes/nike-air-max-90-grey-6.jpg"
        ]
      }
    ],
    "shortDescription": "Biểu tượng thập niên 90 với túi khí lộ đặc trưng.",
    "description": "Không gì có thể vượt qua sự cổ điển đã được kiểm chứng qua thời gian. Air Max 90 vẫn giữ nguyên đế ngoài hoa văn Waffle mang tính biểu tượng và các chi tiết TPU sắc nét.",
    "status": "Đang bán",
    "createdAt": "22/01/2026"
  },
  {
    "id": "nike-blazer-mid-77",
    "sku": "NK-BLZ-07",
    "name": "Nike Blazer Mid '77 Vintage",
    "brand": "Nike",
    "category": "Giày lifestyle",
    "gender": "Unisex",
    "price": 2800000,
    "image": "/src/assets/images/shoes/nike-blazer-mid-77.jpg",
    "images": [
      "/src/assets/images/shoes/nike-blazer-mid-77.jpg",
      "/src/assets/images/shoes/nike-blazer-mid-77-2.jpg",
      "/src/assets/images/shoes/nike-blazer-mid-77-3.jpg",
      "/src/assets/images/shoes/nike-blazer-mid-77-4.jpg",
      "/src/assets/images/shoes/nike-blazer-mid-77-5.jpg",
      "/src/assets/images/shoes/nike-blazer-mid-77-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 89,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "37": 5,
      "38": 7,
      "39": 10,
      "40": 12,
      "41": 8,
      "42": 6,
      "43": 4
    },
    "stockQuantity": 52,
    "colors": [
      {
        "name": "White / Black Swoosh",
        "hex": "#FFFFFF",
        "image": "/src/assets/images/shoes/nike-blazer-mid-77.jpg",
        "images": [
          "/src/assets/images/shoes/nike-blazer-mid-77.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-2.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-3.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-4.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-5.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-6.jpg"
        ]
      },
      {
        "name": "Vintage Orange Swoosh",
        "hex": "#EA580C",
        "image": "/src/assets/images/shoes/nike-blazer-mid-77-orange.jpg",
        "images": [
          "/src/assets/images/shoes/nike-blazer-mid-77-orange.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-orange-2.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-orange-3.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-orange-4.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-orange-5.jpg",
          "/src/assets/images/shoes/nike-blazer-mid-77-orange-6.jpg"
        ]
      }
    ],
    "shortDescription": "Cổ cao vintage phong cách retro bóng rổ thập niên 70.",
    "description": "Với vẻ ngoài cổ điển từ những năm 70, chất liệu da tổng hợp kết hợp các chi tiết da lộn tạo nên điểm nhấn tinh tế cho phong cách ăn mặc tối giản.",
    "status": "Đang bán",
    "createdAt": "25/01/2026"
  },
  {
    "id": "nike-killshot-2",
    "sku": "NK-KILL-08",
    "name": "Nike Killshot 2 Leather",
    "brand": "Nike",
    "category": "Giày lifestyle",
    "gender": "Nam",
    "price": 2650000,
    "image": "/src/assets/images/shoes/nike-killshot-2.jpg",
    "images": [
      "/src/assets/images/shoes/nike-killshot-2.jpg",
      "/src/assets/images/shoes/nike-killshot-2-2.jpg",
      "/src/assets/images/shoes/nike-killshot-2-3.jpg",
      "/src/assets/images/shoes/nike-killshot-2-4.jpg",
      "/src/assets/images/shoes/nike-killshot-2-5.jpg",
      "/src/assets/images/shoes/nike-killshot-2-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 130,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 8,
      "40": 12,
      "41": 15,
      "42": 10,
      "43": 6
    },
    "stockQuantity": 51,
    "colors": [
      {
        "name": "Sail/Midnight Navy",
        "hex": "#1E3A8A",
        "image": "/src/assets/images/shoes/nike-killshot-2.jpg",
        "images": [
          "/src/assets/images/shoes/nike-killshot-2.jpg",
          "/src/assets/images/shoes/nike-killshot-2-2.jpg",
          "/src/assets/images/shoes/nike-killshot-2-3.jpg",
          "/src/assets/images/shoes/nike-killshot-2-4.jpg",
          "/src/assets/images/shoes/nike-killshot-2-5.jpg",
          "/src/assets/images/shoes/nike-killshot-2-6.jpg"
        ]
      },
      {
        "name": "Gum Sole",
        "hex": "#D97706",
        "image": "/src/assets/images/shoes/nike-killshot-2-gum.jpg",
        "images": [
          "/src/assets/images/shoes/nike-killshot-2-gum.jpg",
          "/src/assets/images/shoes/nike-killshot-2-gum-2.jpg",
          "/src/assets/images/shoes/nike-killshot-2-gum-3.jpg",
          "/src/assets/images/shoes/nike-killshot-2-gum-4.jpg",
          "/src/assets/images/shoes/nike-killshot-2-gum-5.jpg",
          "/src/assets/images/shoes/nike-killshot-2-gum-6.jpg"
        ]
      }
    ],
    "shortDescription": "Mẫu giày tennis thanh lịch đế gum kinh điển của phái mạnh.",
    "description": "Lấy cảm hứng từ giày quần vợt cổ thấp, Nike Killshot 2 kết hợp da lộn mềm mại và da trơn cao cấp cùng đế cao su màu kẹo cao su mang lại vẻ đẹp vượt thời gian.",
    "status": "Đang bán",
    "createdAt": "28/01/2026"
  },
  {
    "id": "nike-zoomx-vaporfly-3",
    "sku": "NK-VPF3-09",
    "name": "Nike ZoomX Vaporfly 3",
    "brand": "Nike",
    "category": "Giày chạy bộ",
    "gender": "Nam",
    "price": 6800000,
    "image": "/src/assets/images/shoes/nike-zoomx-vaporfly-3.jpg",
    "images": [
      "/src/assets/images/shoes/nike-zoomx-vaporfly-3.jpg",
      "/src/assets/images/shoes/nike-zoomx-vaporfly-3-2.jpg",
      "/src/assets/images/shoes/nike-zoomx-vaporfly-3-3.jpg",
      "/src/assets/images/shoes/nike-zoomx-vaporfly-3-4.jpg",
      "/src/assets/images/shoes/nike-zoomx-vaporfly-3-5.jpg",
      "/src/assets/images/shoes/nike-zoomx-vaporfly-3-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 74,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "40": 6,
      "41": 10,
      "42": 12,
      "43": 8,
      "44": 4
    },
    "stockQuantity": 40,
    "colors": [
      {
        "name": "Electric Volt",
        "hex": "#84CC16",
        "image": "/src/assets/images/shoes/nike-zoomx-vaporfly-3.jpg",
        "images": [
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-2.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-3.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-4.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-5.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-6.jpg"
        ]
      },
      {
        "name": "Pure White",
        "hex": "#FFFFFF",
        "image": "/src/assets/images/shoes/nike-zoomx-vaporfly-3-white.jpg",
        "images": [
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-white.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-white-2.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-white-3.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-white-4.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-white-5.jpg",
          "/src/assets/images/shoes/nike-zoomx-vaporfly-3-white-6.jpg"
        ]
      }
    ],
    "shortDescription": "Vũ khí tốc độ phá vỡ mọi kỷ lục marathon chuyên nghiệp.",
    "description": "Được mệnh danh là siêu giày chạy bộ đường trường, Vaporfly 3 sở hữu đĩa đệm carbon Flyplate toàn phần và lớp bọt ZoomX đàn hồi nhẹ bậc nhất thế giới.",
    "status": "Đang bán",
    "createdAt": "01/02/2026"
  },
  {
    "id": "nike-pegasus-41",
    "sku": "NK-PEG41-10",
    "name": "Nike Air Zoom Pegasus 41",
    "brand": "Nike",
    "category": "Giày chạy bộ",
    "gender": "Nam",
    "price": 3650000,
    "originalPrice": 4100000,
    "image": "/src/assets/images/shoes/nike-pegasus-41.jpg",
    "images": [
      "/src/assets/images/shoes/nike-pegasus-41.jpg",
      "/src/assets/images/shoes/nike-pegasus-41-2.jpg",
      "/src/assets/images/shoes/nike-pegasus-41-3.jpg",
      "/src/assets/images/shoes/nike-pegasus-41-4.jpg",
      "/src/assets/images/shoes/nike-pegasus-41-5.jpg",
      "/src/assets/images/shoes/nike-pegasus-41-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 215,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 10,
      "40": 15,
      "41": 22,
      "42": 18,
      "43": 10,
      "44": 6
    },
    "stockQuantity": 81,
    "colors": [
      {
        "name": "White/Laser Orange",
        "hex": "#F97316",
        "image": "/src/assets/images/shoes/nike-pegasus-41.jpg",
        "images": [
          "/src/assets/images/shoes/nike-pegasus-41.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-2.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-3.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-4.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-5.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-6.jpg"
        ]
      },
      {
        "name": "Black Smoke",
        "hex": "#18181B",
        "image": "/src/assets/images/shoes/nike-pegasus-41-black.jpg",
        "images": [
          "/src/assets/images/shoes/nike-pegasus-41-black.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-black-2.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-black-3.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-black-4.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-black-5.jpg",
          "/src/assets/images/shoes/nike-pegasus-41-black-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đôi giày chạy quốc dân bền bỉ trang bị bọt ReactX thế hệ mới.",
    "description": "Pegasus 41 tiếp nối truyền thống 4 thập kỷ với đệm khí Air Zoom kép ở gót và mũi chân, kết hợp đế giữa bọt ReactX tiết kiệm năng lượng hơn 13% so với thế hệ trước.",
    "status": "Đang bán",
    "createdAt": "03/02/2026"
  },
  {
    "id": "nike-invincible-3",
    "sku": "NK-INVC-11",
    "name": "Nike ZoomX Invincible Run 3",
    "brand": "Nike",
    "category": "Giày chạy bộ",
    "gender": "Nữ",
    "price": 4950000,
    "image": "/src/assets/images/shoes/nike-invincible-3.jpg",
    "images": [
      "/src/assets/images/shoes/nike-invincible-3.jpg",
      "/src/assets/images/shoes/nike-invincible-3-2.jpg",
      "/src/assets/images/shoes/nike-invincible-3-3.jpg",
      "/src/assets/images/shoes/nike-invincible-3-4.jpg",
      "/src/assets/images/shoes/nike-invincible-3-5.jpg",
      "/src/assets/images/shoes/nike-invincible-3-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 96,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40
    ],
    "sizeStock": {
      "36": 5,
      "37": 10,
      "38": 12,
      "39": 8,
      "40": 5
    },
    "stockQuantity": 40,
    "colors": [
      {
        "name": "Lilac Pink",
        "hex": "#E879F9",
        "image": "/src/assets/images/shoes/nike-invincible-3.jpg",
        "images": [
          "/src/assets/images/shoes/nike-invincible-3.jpg",
          "/src/assets/images/shoes/nike-invincible-3-2.jpg",
          "/src/assets/images/shoes/nike-invincible-3-3.jpg",
          "/src/assets/images/shoes/nike-invincible-3-4.jpg",
          "/src/assets/images/shoes/nike-invincible-3-5.jpg",
          "/src/assets/images/shoes/nike-invincible-3-6.jpg"
        ]
      },
      {
        "name": "Glacier Blue",
        "hex": "#93C5FD",
        "image": "/src/assets/images/shoes/nike-invincible-3-blue.jpg",
        "images": [
          "/src/assets/images/shoes/nike-invincible-3-blue.jpg",
          "/src/assets/images/shoes/nike-invincible-3-blue-2.jpg",
          "/src/assets/images/shoes/nike-invincible-3-blue-3.jpg",
          "/src/assets/images/shoes/nike-invincible-3-blue-4.jpg",
          "/src/assets/images/shoes/nike-invincible-3-blue-5.jpg",
          "/src/assets/images/shoes/nike-invincible-3-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đệm tối đa siêu êm ái bảo vệ khớp gối cho cự ly dài.",
    "description": "Được thiết kế với lượng bọt ZoomX khổng lồ dưới lòng bàn chân, Invincible 3 mang lại cảm giác êm ái tựa như đang bước trên mây, giảm tối đa áp lực cho đôi chân.",
    "status": "Đang bán",
    "createdAt": "05/02/2026"
  },
  {
    "id": "nike-infinity-rn-4",
    "sku": "NK-INF4-12",
    "name": "Nike InfinityRN 4 GORE-TEX",
    "brand": "Nike",
    "category": "Giày chạy bộ",
    "gender": "Nam",
    "price": 4450000,
    "image": "/src/assets/images/shoes/nike-infinity-rn-4.jpg",
    "images": [
      "/src/assets/images/shoes/nike-infinity-rn-4.jpg",
      "/src/assets/images/shoes/nike-infinity-rn-4-2.jpg",
      "/src/assets/images/shoes/nike-infinity-rn-4-3.jpg",
      "/src/assets/images/shoes/nike-infinity-rn-4-4.jpg",
      "/src/assets/images/shoes/nike-infinity-rn-4-5.jpg",
      "/src/assets/images/shoes/nike-infinity-rn-4-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 83,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "40": 8,
      "41": 14,
      "42": 12,
      "43": 8,
      "44": 5
    },
    "stockQuantity": 47,
    "colors": [
      {
        "name": "Waterproof Black",
        "hex": "#111827",
        "image": "/src/assets/images/shoes/nike-infinity-rn-4.jpg",
        "images": [
          "/src/assets/images/shoes/nike-infinity-rn-4.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-2.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-3.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-4.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-5.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-6.jpg"
        ]
      },
      {
        "name": "Cobalt Dark / Volt",
        "hex": "#1E40AF",
        "image": "/src/assets/images/shoes/nike-infinity-rn-4-blue.jpg",
        "images": [
          "/src/assets/images/shoes/nike-infinity-rn-4-blue.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-blue-2.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-blue-3.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-blue-4.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-blue-5.jpg",
          "/src/assets/images/shoes/nike-infinity-rn-4-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Màng chống nước GORE-TEX giúp bạn chinh phục mọi cung đường ẩm ướt.",
    "description": "Trang bị công nghệ màng ngăn chống thấm nước GORE-TEX, giữ chân luôn khô ráo và ấm áp trong những ngày mưa mà vẫn đảm bảo độ thông thoáng tối ưu.",
    "status": "Đang bán",
    "createdAt": "08/02/2026"
  },
  {
    "id": "nike-mercurial-superfly-10",
    "sku": "NK-MERC-13",
    "name": "Nike Mercurial Superfly 10 Elite FG",
    "brand": "Nike",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 6200000,
    "image": "/src/assets/images/shoes/nike-mercurial-superfly-10.jpg",
    "images": [
      "/src/assets/images/shoes/nike-mercurial-superfly-10.jpg",
      "/src/assets/images/shoes/nike-mercurial-superfly-10-2.jpg",
      "/src/assets/images/shoes/nike-mercurial-superfly-10-3.jpg",
      "/src/assets/images/shoes/nike-mercurial-superfly-10-4.jpg",
      "/src/assets/images/shoes/nike-mercurial-superfly-10-5.jpg",
      "/src/assets/images/shoes/nike-mercurial-superfly-10-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 110,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 4,
      "40": 8,
      "41": 12,
      "42": 9,
      "43": 5
    },
    "stockQuantity": 38,
    "colors": [
      {
        "name": "Kylian Blue / Volt",
        "hex": "#2563EB",
        "image": "/src/assets/images/shoes/nike-mercurial-superfly-10.jpg",
        "images": [
          "/src/assets/images/shoes/nike-mercurial-superfly-10.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-2.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-3.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-4.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-5.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-6.jpg"
        ]
      },
      {
        "name": "Sunset Pink / Gold",
        "hex": "#EC4899",
        "image": "/src/assets/images/shoes/nike-mercurial-superfly-10-pink.jpg",
        "images": [
          "/src/assets/images/shoes/nike-mercurial-superfly-10-pink.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-pink-2.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-pink-3.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-pink-4.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-pink-5.jpg",
          "/src/assets/images/shoes/nike-mercurial-superfly-10-pink-6.jpg"
        ]
      }
    ],
    "shortDescription": "Vũ khí bứt tốc xé gió của các ngôi sao sân cỏ hàng đầu.",
    "description": "Trang bị túi khí Air Zoom 3/4 chuyên biệt cho sân bóng, cổ Flyknit ôm sát mắt cá chân và bề mặt Gripknit tăng cảm giác bóng trong từng pha chạm.",
    "status": "Đang bán",
    "createdAt": "10/02/2026"
  },
  {
    "id": "nike-phantom-gx",
    "sku": "NK-PHANTOM-14",
    "name": "Nike Phantom GX 2 Pro TF",
    "brand": "Nike",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 3100000,
    "originalPrice": 3500000,
    "image": "/src/assets/images/shoes/nike-phantom-gx.jpg",
    "images": [
      "/src/assets/images/shoes/nike-phantom-gx.jpg",
      "/src/assets/images/shoes/nike-phantom-gx-2.jpg",
      "/src/assets/images/shoes/nike-phantom-gx-3.jpg",
      "/src/assets/images/shoes/nike-phantom-gx-4.jpg",
      "/src/assets/images/shoes/nike-phantom-gx-5.jpg",
      "/src/assets/images/shoes/nike-phantom-gx-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 88,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0
    },
    "stockQuantity": 0,
    "colors": [
      {
        "name": "Vortex Green",
        "hex": "#10B981",
        "image": "/src/assets/images/shoes/nike-phantom-gx.jpg",
        "images": [
          "/src/assets/images/shoes/nike-phantom-gx.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-2.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-3.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-4.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-5.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-6.jpg"
        ]
      },
      {
        "name": "Crimson Red / Black",
        "hex": "#DC2626",
        "image": "/src/assets/images/shoes/nike-phantom-gx-red.jpg",
        "images": [
          "/src/assets/images/shoes/nike-phantom-gx-red.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-red-2.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-red-3.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-red-4.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-red-5.jpg",
          "/src/assets/images/shoes/nike-phantom-gx-red-6.jpg"
        ]
      }
    ],
    "shortDescription": "Kiểm soát bóng đỉnh cao và chính xác tuyệt đối trên sân cỏ nhân tạo.",
    "description": "Chất liệu NikeSkin bao bọc khu vực tiếp xúc bóng, đinh dăm TF bám sân vững chắc cho những pha xử lý bóng ma thuật trong phạm vi hẹp.",
    "status": "Ngừng kinh doanh",
    "createdAt": "12/02/2026"
  },
  {
    "id": "nike-tiempo-legend-10",
    "sku": "NK-TIEMPO-15",
    "name": "Nike Tiempo Legend 10 Academy TF",
    "brand": "Nike",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 2150000,
    "image": "/src/assets/images/shoes/nike-tiempo-legend-10.jpg",
    "images": [
      "/src/assets/images/shoes/nike-tiempo-legend-10.jpg",
      "/src/assets/images/shoes/nike-tiempo-legend-10-2.jpg",
      "/src/assets/images/shoes/nike-tiempo-legend-10-3.jpg",
      "/src/assets/images/shoes/nike-tiempo-legend-10-4.jpg",
      "/src/assets/images/shoes/nike-tiempo-legend-10-5.jpg",
      "/src/assets/images/shoes/nike-tiempo-legend-10-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 145,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 6,
      "40": 12,
      "41": 18,
      "42": 15,
      "43": 8,
      "44": 5
    },
    "stockQuantity": 64,
    "colors": [
      {
        "name": "Guava Ice / Yellow",
        "hex": "#FDE68A",
        "image": "/src/assets/images/shoes/nike-tiempo-legend-10.jpg",
        "images": [
          "/src/assets/images/shoes/nike-tiempo-legend-10.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-2.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-3.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-4.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-5.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-6.jpg"
        ]
      },
      {
        "name": "Emerald Green / White",
        "hex": "#059669",
        "image": "/src/assets/images/shoes/nike-tiempo-legend-10-green.jpg",
        "images": [
          "/src/assets/images/shoes/nike-tiempo-legend-10-green.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-green-2.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-green-3.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-green-4.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-green-5.jpg",
          "/src/assets/images/shoes/nike-tiempo-legend-10-green-6.jpg"
        ]
      }
    ],
    "shortDescription": "Da kỹ thuật FlyTouch Lite siêu mềm, chạm bóng mượt mà.",
    "description": "Thế hệ Tiempo nhẹ hơn và ôm sát bàn chân hơn bất kỳ phiên bản nào trước đây, mang lại sự thoải mái cho suốt 90 phút thi đấu.",
    "status": "Đang bán",
    "createdAt": "15/02/2026"
  },
  {
    "id": "nike-metcon-9",
    "sku": "NK-METCON-16",
    "name": "Nike Metcon 9 Workout",
    "brand": "Nike",
    "category": "Training",
    "gender": "Unisex",
    "price": 3800000,
    "originalPrice": 4200000,
    "image": "/src/assets/images/shoes/nike-metcon-9.jpg",
    "images": [
      "/src/assets/images/shoes/nike-metcon-9.jpg",
      "/src/assets/images/shoes/nike-metcon-9-2.jpg",
      "/src/assets/images/shoes/nike-metcon-9-3.jpg",
      "/src/assets/images/shoes/nike-metcon-9-4.jpg",
      "/src/assets/images/shoes/nike-metcon-9-5.jpg",
      "/src/assets/images/shoes/nike-metcon-9-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 135,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 5,
      "40": 10,
      "41": 15,
      "42": 12,
      "43": 6
    },
    "stockQuantity": 48,
    "colors": [
      {
        "name": "Smoke Grey / Orange",
        "hex": "#4B5563",
        "image": "/src/assets/images/shoes/nike-metcon-9.jpg",
        "images": [
          "/src/assets/images/shoes/nike-metcon-9.jpg",
          "/src/assets/images/shoes/nike-metcon-9-2.jpg",
          "/src/assets/images/shoes/nike-metcon-9-3.jpg",
          "/src/assets/images/shoes/nike-metcon-9-4.jpg",
          "/src/assets/images/shoes/nike-metcon-9-5.jpg",
          "/src/assets/images/shoes/nike-metcon-9-6.jpg"
        ]
      },
      {
        "name": "Deep Cobalt / Volt",
        "hex": "#2563EB",
        "image": "/src/assets/images/shoes/nike-metcon-9-blue.jpg",
        "images": [
          "/src/assets/images/shoes/nike-metcon-9-blue.jpg",
          "/src/assets/images/shoes/nike-metcon-9-blue-2.jpg",
          "/src/assets/images/shoes/nike-metcon-9-blue-3.jpg",
          "/src/assets/images/shoes/nike-metcon-9-blue-4.jpg",
          "/src/assets/images/shoes/nike-metcon-9-blue-5.jpg",
          "/src/assets/images/shoes/nike-metcon-9-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Tiêu chuẩn vàng cho tập gym, cử tạ và cross-training.",
    "description": "Tấm Hyperlift ở gót chân được mở rộng lớn hơn giúp tạo bệ đỡ vững chắc cho các bài squat và deadlift nặng, lớp bọc cao su chống mài mòn khi leo dây.",
    "status": "Đang bán",
    "createdAt": "18/02/2026"
  },
  {
    "id": "adidas-ultraboost-light",
    "sku": "AD-UBL-17",
    "name": "Adidas Ultraboost Light",
    "brand": "Adidas",
    "category": "Giày chạy bộ",
    "gender": "Unisex",
    "price": 5200000,
    "originalPrice": 5800000,
    "image": "/src/assets/images/shoes/adidas-ultraboost-light.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-ultraboost-light.jpg",
      "/src/assets/images/shoes/adidas-ultraboost-light-2.jpg",
      "/src/assets/images/shoes/adidas-ultraboost-light-3.jpg",
      "/src/assets/images/shoes/adidas-ultraboost-light-4.jpg",
      "/src/assets/images/shoes/adidas-ultraboost-light-5.jpg",
      "/src/assets/images/shoes/adidas-ultraboost-light-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 289,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45
    ],
    "sizeStock": {
      "37": 5,
      "38": 8,
      "39": 12,
      "40": 18,
      "41": 22,
      "42": 20,
      "43": 15,
      "44": 8,
      "45": 4
    },
    "stockQuantity": 112,
    "colors": [
      {
        "name": "Core Black",
        "hex": "#111111",
        "image": "/src/assets/images/shoes/adidas-ultraboost-light.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-ultraboost-light.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-2.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-3.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-4.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-5.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-6.jpg"
        ]
      },
      {
        "name": "Cloud White",
        "hex": "#FFFFFF",
        "image": "/src/assets/images/shoes/adidas-ultraboost-light-white.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-ultraboost-light-white.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-white-2.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-white-3.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-white-4.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-white-5.jpg",
          "/src/assets/images/shoes/adidas-ultraboost-light-white-6.jpg"
        ]
      }
    ],
    "shortDescription": "Phiên bản Ultraboost nhẹ nhất từ trước đến nay, đàn hồi vượt bậc.",
    "description": "Trải nghiệm năng lượng đỉnh cao với Ultraboost Light - phiên bản Ultraboost nhẹ nhất từ trước đến nay. Đế giữa Light BOOST thế hệ mới mang lại khả năng hoàn trả năng lượng tối đa trên từng bước chạy, kết hợp với thân giày Primeknit ôm sát, thoáng khí.",
    "status": "Đang bán",
    "createdAt": "15/01/2026"
  },
  {
    "id": "adidas-samba-og",
    "sku": "AD-SAMBA-18",
    "name": "Adidas Samba OG Cloud White",
    "brand": "Adidas",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2700000,
    "image": "/src/assets/images/shoes/adidas-samba-og.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-samba-og.jpg",
      "/src/assets/images/shoes/adidas-samba-og-2.jpg",
      "/src/assets/images/shoes/adidas-samba-og-3.jpg",
      "/src/assets/images/shoes/adidas-samba-og-4.jpg",
      "/src/assets/images/shoes/adidas-samba-og-5.jpg",
      "/src/assets/images/shoes/adidas-samba-og-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 350,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "36": 8,
      "37": 12,
      "38": 15,
      "39": 20,
      "40": 25,
      "41": 20,
      "42": 15,
      "43": 8
    },
    "stockQuantity": 123,
    "colors": [
      {
        "name": "Cloud White / Core Black",
        "hex": "#FFFFFF",
        "image": "/src/assets/images/shoes/adidas-samba-og.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-samba-og.jpg",
          "/src/assets/images/shoes/adidas-samba-og-2.jpg",
          "/src/assets/images/shoes/adidas-samba-og-3.jpg",
          "/src/assets/images/shoes/adidas-samba-og-4.jpg",
          "/src/assets/images/shoes/adidas-samba-og-5.jpg",
          "/src/assets/images/shoes/adidas-samba-og-6.jpg"
        ]
      },
      {
        "name": "Cloud White / Collegiate Green",
        "hex": "#047857",
        "image": "/src/assets/images/shoes/adidas-samba-og-green.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-samba-og-green.jpg",
          "/src/assets/images/shoes/adidas-samba-og-green-2.jpg",
          "/src/assets/images/shoes/adidas-samba-og-green-3.jpg",
          "/src/assets/images/shoes/adidas-samba-og-green-4.jpg",
          "/src/assets/images/shoes/adidas-samba-og-green-5.jpg",
          "/src/assets/images/shoes/adidas-samba-og-green-6.jpg"
        ]
      }
    ],
    "shortDescription": "Cơn sốt thời trang đường phố toàn cầu với vẻ đẹp retro bất hủ.",
    "description": "Sinh ra trên sân cỏ và trở thành biểu tượng thời trang đường phố trường tồn. Mũi giày chữ T bọc da lộn kết hợp đế cao su gum kinh điển giúp Adidas Samba OG thống trị mọi outfit.",
    "status": "Đang bán",
    "createdAt": "16/01/2026"
  },
  {
    "id": "adidas-gazelle-indoor",
    "sku": "AD-GAZ-19",
    "name": "Adidas Gazelle Indoor Collegiate Green",
    "brand": "Adidas",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2900000,
    "image": "/src/assets/images/shoes/adidas-gazelle-indoor.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-gazelle-indoor.jpg",
      "/src/assets/images/shoes/adidas-gazelle-indoor-2.jpg",
      "/src/assets/images/shoes/adidas-gazelle-indoor-3.jpg",
      "/src/assets/images/shoes/adidas-gazelle-indoor-4.jpg",
      "/src/assets/images/shoes/adidas-gazelle-indoor-5.jpg",
      "/src/assets/images/shoes/adidas-gazelle-indoor-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 164,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      37,
      38,
      39,
      40,
      41,
      42
    ],
    "sizeStock": {
      "37": 6,
      "38": 10,
      "39": 14,
      "40": 16,
      "41": 12,
      "42": 7
    },
    "stockQuantity": 65,
    "colors": [
      {
        "name": "Collegiate Green",
        "hex": "#047857",
        "image": "/src/assets/images/shoes/adidas-gazelle-indoor.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-gazelle-indoor.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-2.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-3.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-4.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-5.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-6.jpg"
        ]
      },
      {
        "name": "Scarlet Red / Gum",
        "hex": "#DC2626",
        "image": "/src/assets/images/shoes/adidas-gazelle-indoor-red.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-gazelle-indoor-red.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-red-2.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-red-3.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-red-4.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-red-5.jpg",
          "/src/assets/images/shoes/adidas-gazelle-indoor-red-6.jpg"
        ]
      }
    ],
    "shortDescription": "Chất liệu da lộn mềm mượt cùng đế cao su trong suốt độc đáo.",
    "description": "Phiên bản Gazelle Indoor tái hiện phong cách tập luyện trong nhà thập niên 60 với chất da lộn mềm mại sang trọng và đế cao su trong suốt bao bọc quanh thân giày.",
    "status": "Đang bán",
    "createdAt": "20/01/2026"
  },
  {
    "id": "adidas-stan-smith",
    "sku": "AD-STAN-20",
    "name": "Adidas Stan Smith Classic White Green",
    "brand": "Adidas",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2400000,
    "originalPrice": 2700000,
    "image": "/src/assets/images/shoes/adidas-stan-smith.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-stan-smith.jpg",
      "/src/assets/images/shoes/adidas-stan-smith-2.jpg",
      "/src/assets/images/shoes/adidas-stan-smith-3.jpg",
      "/src/assets/images/shoes/adidas-stan-smith-4.jpg",
      "/src/assets/images/shoes/adidas-stan-smith-5.jpg",
      "/src/assets/images/shoes/adidas-stan-smith-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 310,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "36": 8,
      "37": 12,
      "38": 15,
      "39": 18,
      "40": 20,
      "41": 15,
      "42": 10,
      "43": 6
    },
    "stockQuantity": 104,
    "colors": [
      {
        "name": "White / Fairway Green",
        "hex": "#15803D",
        "image": "/src/assets/images/shoes/adidas-stan-smith.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-stan-smith.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-2.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-3.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-4.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-5.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-6.jpg"
        ]
      },
      {
        "name": "White / Collegiate Navy",
        "hex": "#1E3A8A",
        "image": "/src/assets/images/shoes/adidas-stan-smith-navy.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-stan-smith-navy.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-navy-2.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-navy-3.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-navy-4.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-navy-5.jpg",
          "/src/assets/images/shoes/adidas-stan-smith-navy-6.jpg"
        ]
      }
    ],
    "shortDescription": "Thiết kế tối giản thuần khiết phù hợp cho mọi lứa tuổi và trang phục.",
    "description": "Đôi giày tennis mang tên huyền thoại Stan Smith với 3 hàng lỗ đục thoáng khí đặc trưng. Kiểu dáng thanh thoát, tinh tế trường tồn hơn 50 năm qua.",
    "status": "Đang bán",
    "createdAt": "22/01/2026"
  },
  {
    "id": "adidas-superstar-foundation",
    "sku": "AD-STAR-21",
    "name": "Adidas Superstar Foundation",
    "brand": "Adidas",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2600000,
    "image": "/src/assets/images/shoes/adidas-superstar-foundation.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-superstar-foundation.jpg",
      "/src/assets/images/shoes/adidas-superstar-foundation-2.jpg",
      "/src/assets/images/shoes/adidas-superstar-foundation-3.jpg",
      "/src/assets/images/shoes/adidas-superstar-foundation-4.jpg",
      "/src/assets/images/shoes/adidas-superstar-foundation-5.jpg",
      "/src/assets/images/shoes/adidas-superstar-foundation-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 280,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "37": 5,
      "38": 10,
      "39": 14,
      "40": 18,
      "41": 16,
      "42": 12,
      "43": 6
    },
    "stockQuantity": 81,
    "colors": [
      {
        "name": "Core White / Black",
        "hex": "#FFFFFF",
        "image": "/src/assets/images/shoes/adidas-superstar-foundation.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-superstar-foundation.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-2.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-3.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-4.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-5.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-6.jpg"
        ]
      },
      {
        "name": "White / Metallic Gold",
        "hex": "#D97706",
        "image": "/src/assets/images/shoes/adidas-superstar-foundation-gold.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-superstar-foundation-gold.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-gold-2.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-gold-3.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-gold-4.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-gold-5.jpg",
          "/src/assets/images/shoes/adidas-superstar-foundation-gold-6.jpg"
        ]
      }
    ],
    "shortDescription": "Mũi sò Shell-toe huyền thoại định hình văn hóa hip-hop đường phố.",
    "description": "Kể từ khi xuất hiện trên sàn bóng rổ năm 1969, Superstar đã trở thành tượng đài âm nhạc và thời trang đường phố với chi tiết mũi giày vỏ sò bảo vệ ngón chân độc nhất.",
    "status": "Đang bán",
    "createdAt": "24/01/2026"
  },
  {
    "id": "adidas-campus-00s",
    "sku": "AD-CAMP-22",
    "name": "Adidas Campus 00s Core Black",
    "brand": "Adidas",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2850000,
    "image": "/src/assets/images/shoes/adidas-campus-00s.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-campus-00s.jpg",
      "/src/assets/images/shoes/adidas-campus-00s-2.jpg",
      "/src/assets/images/shoes/adidas-campus-00s-3.jpg",
      "/src/assets/images/shoes/adidas-campus-00s-4.jpg",
      "/src/assets/images/shoes/adidas-campus-00s-5.jpg",
      "/src/assets/images/shoes/adidas-campus-00s-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 198,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "38": 6,
      "39": 12,
      "40": 16,
      "41": 18,
      "42": 14,
      "43": 8
    },
    "stockQuantity": 74,
    "colors": [
      {
        "name": "Core Black / White",
        "hex": "#111827",
        "image": "/src/assets/images/shoes/adidas-campus-00s.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-campus-00s.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-2.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-3.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-4.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-5.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-6.jpg"
        ]
      },
      {
        "name": "Forest Green Suede",
        "hex": "#15803D",
        "image": "/src/assets/images/shoes/adidas-campus-00s-green.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-campus-00s-green.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-green-2.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-green-3.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-green-4.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-green-5.jpg",
          "/src/assets/images/shoes/adidas-campus-00s-green-6.jpg"
        ]
      }
    ],
    "shortDescription": "Phong cách trượt ván Y2K hầm hố với dây giày bản to cực chất.",
    "description": "Lấy cảm hứng từ thời kỳ trượt ván những năm 2000, Campus 00s làm mới form dáng thon gọn cổ điển thành thiết kế chunky cá tính, lưỡi gà dày êm ái.",
    "status": "Đang bán",
    "createdAt": "26/01/2026"
  },
  {
    "id": "adidas-forum-low",
    "sku": "AD-FORUM-23",
    "name": "Adidas Forum Low White Royal Blue",
    "brand": "Adidas",
    "category": "Giày lifestyle",
    "gender": "Nam",
    "price": 2750000,
    "originalPrice": 3100000,
    "image": "/src/assets/images/shoes/adidas-forum-low.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-forum-low.jpg",
      "/src/assets/images/shoes/adidas-forum-low-2.jpg",
      "/src/assets/images/shoes/adidas-forum-low-3.jpg",
      "/src/assets/images/shoes/adidas-forum-low-4.jpg",
      "/src/assets/images/shoes/adidas-forum-low-5.jpg",
      "/src/assets/images/shoes/adidas-forum-low-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 125,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 6,
      "40": 10,
      "41": 15,
      "42": 12,
      "43": 5
    },
    "stockQuantity": 48,
    "colors": [
      {
        "name": "White / Royal Blue",
        "hex": "#1D4ED8",
        "image": "/src/assets/images/shoes/adidas-forum-low.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-forum-low.jpg",
          "/src/assets/images/shoes/adidas-forum-low-2.jpg",
          "/src/assets/images/shoes/adidas-forum-low-3.jpg",
          "/src/assets/images/shoes/adidas-forum-low-4.jpg",
          "/src/assets/images/shoes/adidas-forum-low-5.jpg",
          "/src/assets/images/shoes/adidas-forum-low-6.jpg"
        ]
      },
      {
        "name": "White / Crimson Red",
        "hex": "#DC2626",
        "image": "/src/assets/images/shoes/adidas-forum-low-red.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-forum-low-red.jpg",
          "/src/assets/images/shoes/adidas-forum-low-red-2.jpg",
          "/src/assets/images/shoes/adidas-forum-low-red-3.jpg",
          "/src/assets/images/shoes/adidas-forum-low-red-4.jpg",
          "/src/assets/images/shoes/adidas-forum-low-red-5.jpg",
          "/src/assets/images/shoes/adidas-forum-low-red-6.jpg"
        ]
      }
    ],
    "shortDescription": "Quai dán mắt cá chân phong cách bóng rổ thập niên 80 năng động.",
    "description": "Thiết kế chữ X đặc trưng bên hông và quai dán tháo rời cổ điển mang lại vẻ đẹp đậm chất retro cho những ai đam mê phong cách vintage thể thao.",
    "status": "Đang bán",
    "createdAt": "29/01/2026"
  },
  {
    "id": "adidas-adizero-adios-pro-3",
    "sku": "AD-ADIOS-24",
    "name": "Adidas Adizero Adios Pro 3",
    "brand": "Adidas",
    "category": "Giày chạy bộ",
    "gender": "Unisex",
    "price": 6500000,
    "image": "/src/assets/images/shoes/adidas-adizero-adios-pro-3.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-adizero-adios-pro-3.jpg",
      "/src/assets/images/shoes/adidas-adizero-adios-pro-3-2.jpg",
      "/src/assets/images/shoes/adidas-adizero-adios-pro-3-3.jpg",
      "/src/assets/images/shoes/adidas-adizero-adios-pro-3-4.jpg",
      "/src/assets/images/shoes/adidas-adizero-adios-pro-3-5.jpg",
      "/src/assets/images/shoes/adidas-adizero-adios-pro-3-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 68,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "40": 4,
      "41": 8,
      "42": 10,
      "43": 6
    },
    "stockQuantity": 28,
    "colors": [
      {
        "name": "Lucid Cyan",
        "hex": "#06B6D4",
        "image": "/src/assets/images/shoes/adidas-adizero-adios-pro-3.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-2.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-3.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-4.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-5.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-6.jpg"
        ]
      },
      {
        "name": "Solar Orange / Flame",
        "hex": "#F97316",
        "image": "/src/assets/images/shoes/adidas-adizero-adios-pro-3-orange.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-orange.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-orange-2.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-orange-3.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-orange-4.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-orange-5.jpg",
          "/src/assets/images/shoes/adidas-adizero-adios-pro-3-orange-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đỉnh cao giày đua marathon với các thanh carbon EnergyRods 2.0.",
    "description": "Cỗ máy tốc độ từng cùng các vận động viên vô địch nhiều giải marathon thế giới. Hai lớp bọt Lightstrike Pro siêu nhẹ ôm trọn các thanh carbon mang lại lực đẩy bùng nổ.",
    "status": "Đang bán",
    "createdAt": "02/02/2026"
  },
  {
    "id": "adidas-boston-12",
    "sku": "AD-BOST-25",
    "name": "Adidas Adizero Boston 12",
    "brand": "Adidas",
    "category": "Giày chạy bộ",
    "gender": "Nam",
    "price": 3800000,
    "originalPrice": 4200000,
    "image": "/src/assets/images/shoes/adidas-boston-12.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-boston-12.jpg",
      "/src/assets/images/shoes/adidas-boston-12-2.jpg",
      "/src/assets/images/shoes/adidas-boston-12-3.jpg",
      "/src/assets/images/shoes/adidas-boston-12-4.jpg",
      "/src/assets/images/shoes/adidas-boston-12-5.jpg",
      "/src/assets/images/shoes/adidas-boston-12-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 140,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 8,
      "40": 14,
      "41": 18,
      "42": 15,
      "43": 10,
      "44": 5
    },
    "stockQuantity": 70,
    "colors": [
      {
        "name": "Solar Yellow / Black",
        "hex": "#EAB308",
        "image": "/src/assets/images/shoes/adidas-boston-12.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-boston-12.jpg",
          "/src/assets/images/shoes/adidas-boston-12-2.jpg",
          "/src/assets/images/shoes/adidas-boston-12-3.jpg",
          "/src/assets/images/shoes/adidas-boston-12-4.jpg",
          "/src/assets/images/shoes/adidas-boston-12-5.jpg",
          "/src/assets/images/shoes/adidas-boston-12-6.jpg"
        ]
      },
      {
        "name": "Cobalt Blue / Volt",
        "hex": "#2563EB",
        "image": "/src/assets/images/shoes/adidas-boston-12-blue.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-boston-12-blue.jpg",
          "/src/assets/images/shoes/adidas-boston-12-blue-2.jpg",
          "/src/assets/images/shoes/adidas-boston-12-blue-3.jpg",
          "/src/assets/images/shoes/adidas-boston-12-blue-4.jpg",
          "/src/assets/images/shoes/adidas-boston-12-blue-5.jpg",
          "/src/assets/images/shoes/adidas-boston-12-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đôi giày luyện tập tốc độ và thi đấu bán marathon lý tưởng.",
    "description": "Sự phối hợp giữa hai loại đệm Lightstrike Pro và Lightstrike 2.0 tạo nên cảm giác tiếp đất mượt mà, đàn hồi và bền bỉ qua hàng trăm kilomet tập luyện.",
    "status": "Đang bán",
    "createdAt": "05/02/2026"
  },
  {
    "id": "adidas-supernova-rise",
    "sku": "AD-NOVA-26",
    "name": "Adidas Supernova Rise",
    "brand": "Adidas",
    "category": "Giày chạy bộ",
    "gender": "Nữ",
    "price": 3200000,
    "image": "/src/assets/images/shoes/adidas-supernova-rise.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-supernova-rise.jpg",
      "/src/assets/images/shoes/adidas-supernova-rise-2.jpg",
      "/src/assets/images/shoes/adidas-supernova-rise-3.jpg",
      "/src/assets/images/shoes/adidas-supernova-rise-4.jpg",
      "/src/assets/images/shoes/adidas-supernova-rise-5.jpg",
      "/src/assets/images/shoes/adidas-supernova-rise-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 92,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40
    ],
    "sizeStock": {
      "36": 6,
      "37": 12,
      "38": 15,
      "39": 10,
      "40": 6
    },
    "stockQuantity": 49,
    "colors": [
      {
        "name": "Semi Green Spark",
        "hex": "#4ADE80",
        "image": "/src/assets/images/shoes/adidas-supernova-rise.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-supernova-rise.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-2.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-3.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-4.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-5.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-6.jpg"
        ]
      },
      {
        "name": "Sunset Coral / Pink",
        "hex": "#FB7185",
        "image": "/src/assets/images/shoes/adidas-supernova-rise-coral.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-supernova-rise-coral.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-coral-2.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-coral-3.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-coral-4.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-coral-5.jpg",
          "/src/assets/images/shoes/adidas-supernova-rise-coral-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đệm Dreamstrike+ siêu êm mang lại trải nghiệm chạy bộ mỗi ngày thư thái.",
    "description": "Được thiết kế riêng nhằm đem lại sự êm ái tối đa cho những bước chạy thường nhật. Hệ thống thanh đệm Support Rods định hình bước chân cân bằng tự nhiên.",
    "status": "Đang bán",
    "createdAt": "08/02/2026"
  },
  {
    "id": "adidas-predator-elite-fg",
    "sku": "AD-PRED-27",
    "name": "Adidas Predator Elite LL FG",
    "brand": "Adidas",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 6800000,
    "image": "/src/assets/images/shoes/adidas-predator-elite-fg.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-predator-elite-fg.jpg",
      "/src/assets/images/shoes/adidas-predator-elite-fg-2.jpg",
      "/src/assets/images/shoes/adidas-predator-elite-fg-3.jpg",
      "/src/assets/images/shoes/adidas-predator-elite-fg-4.jpg",
      "/src/assets/images/shoes/adidas-predator-elite-fg-5.jpg",
      "/src/assets/images/shoes/adidas-predator-elite-fg-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 150,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 4,
      "40": 8,
      "41": 12,
      "42": 10,
      "43": 5
    },
    "stockQuantity": 39,
    "colors": [
      {
        "name": "Core Black / Solar Red",
        "hex": "#DC2626",
        "image": "/src/assets/images/shoes/adidas-predator-elite-fg.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-predator-elite-fg.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-2.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-3.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-4.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-5.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-6.jpg"
        ]
      },
      {
        "name": "Solar Yellow / Electric Blue",
        "hex": "#EAB308",
        "image": "/src/assets/images/shoes/adidas-predator-elite-fg-yellow.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-predator-elite-fg-yellow.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-yellow-2.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-yellow-3.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-yellow-4.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-yellow-5.jpg",
          "/src/assets/images/shoes/adidas-predator-elite-fg-yellow-6.jpg"
        ]
      }
    ],
    "shortDescription": "Kẻ săn bàn thượng hạng với công nghệ gai cao su Strikeskin.",
    "description": "Phiên bản không dây (Laceless) cao cấp nhất của dòng quái thú Predator. Các gai cao su Strikeskin ở mu bàn chân giúp tạo độ xoáy và độ chính xác chết chóc trong các pha dứt điểm.",
    "status": "Đang bán",
    "createdAt": "11/02/2026"
  },
  {
    "id": "adidas-f50-league-tf",
    "sku": "AD-F50-28",
    "name": "Adidas F50 League TF",
    "brand": "Adidas",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 2400000,
    "originalPrice": 2700000,
    "image": "/src/assets/images/shoes/adidas-f50-league-tf.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-f50-league-tf.jpg",
      "/src/assets/images/shoes/adidas-f50-league-tf-2.jpg",
      "/src/assets/images/shoes/adidas-f50-league-tf-3.jpg",
      "/src/assets/images/shoes/adidas-f50-league-tf-4.jpg",
      "/src/assets/images/shoes/adidas-f50-league-tf-5.jpg",
      "/src/assets/images/shoes/adidas-f50-league-tf-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 105,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 6,
      "40": 12,
      "41": 16,
      "42": 14,
      "43": 8
    },
    "stockQuantity": 56,
    "colors": [
      {
        "name": "White / Lucid Blue",
        "hex": "#3B82F6",
        "image": "/src/assets/images/shoes/adidas-f50-league-tf.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-f50-league-tf.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-2.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-3.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-4.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-5.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-6.jpg"
        ]
      },
      {
        "name": "Solar Red / Lucid Blue",
        "hex": "#EF4444",
        "image": "/src/assets/images/shoes/adidas-f50-league-tf-red.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-f50-league-tf-red.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-red-2.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-red-3.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-red-4.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-red-5.jpg",
          "/src/assets/images/shoes/adidas-f50-league-tf-red-6.jpg"
        ]
      }
    ],
    "shortDescription": "Biểu tượng tốc độ F50 tái sinh trên mặt sân cỏ nhân tạo.",
    "description": "Thân giày Fiberskin siêu mỏng và lưỡi gà co giãn Tunnel Tongue ôm khít chân, đem lại cảm giác bóng chân thật và khả năng đổi hướng nhanh như chớp.",
    "status": "Đang bán",
    "createdAt": "14/02/2026"
  },
  {
    "id": "adidas-copa-pure-2",
    "sku": "AD-COPA-29",
    "name": "Adidas Copa Pure 2 Club TF",
    "brand": "Adidas",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 1850000,
    "image": "/src/assets/images/shoes/adidas-copa-pure-2.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-copa-pure-2.jpg",
      "/src/assets/images/shoes/adidas-copa-pure-2-2.jpg",
      "/src/assets/images/shoes/adidas-copa-pure-2-3.jpg",
      "/src/assets/images/shoes/adidas-copa-pure-2-4.jpg",
      "/src/assets/images/shoes/adidas-copa-pure-2-5.jpg",
      "/src/assets/images/shoes/adidas-copa-pure-2-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 82,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 5,
      "40": 10,
      "41": 14,
      "42": 12,
      "43": 7
    },
    "stockQuantity": 48,
    "colors": [
      {
        "name": "Shadow Black",
        "hex": "#1F2937",
        "image": "/src/assets/images/shoes/adidas-copa-pure-2.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-copa-pure-2.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-2.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-3.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-4.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-5.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-6.jpg"
        ]
      },
      {
        "name": "Lucid Blue / Black",
        "hex": "#2563EB",
        "image": "/src/assets/images/shoes/adidas-copa-pure-2-blue.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-copa-pure-2-blue.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-blue-2.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-blue-3.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-blue-4.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-blue-5.jpg",
          "/src/assets/images/shoes/adidas-copa-pure-2-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Cảm giác bóng mượt mà với phần mũi bọc da tổng hợp êm ái.",
    "description": "Dành cho những cầu thủ ưa chuộng lối chơi kiểm soát điềm tĩnh. Form dáng thoải mái, đinh dăm bám sân tốt và độ bền cao.",
    "status": "Đang bán",
    "createdAt": "16/02/2026"
  },
  {
    "id": "adidas-dropset-2",
    "sku": "AD-DROP-30",
    "name": "Adidas Dropset 2 Trainer",
    "brand": "Adidas",
    "category": "Training",
    "gender": "Nam",
    "price": 3100000,
    "image": "/src/assets/images/shoes/adidas-dropset-2.jpg",
    "images": [
      "/src/assets/images/shoes/adidas-dropset-2.jpg",
      "/src/assets/images/shoes/adidas-dropset-2-2.jpg",
      "/src/assets/images/shoes/adidas-dropset-2-3.jpg",
      "/src/assets/images/shoes/adidas-dropset-2-4.jpg",
      "/src/assets/images/shoes/adidas-dropset-2-5.jpg",
      "/src/assets/images/shoes/adidas-dropset-2-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 75,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 6,
      "40": 10,
      "41": 12,
      "42": 8,
      "43": 5
    },
    "stockQuantity": 41,
    "colors": [
      {
        "name": "Olive Strata / Black",
        "hex": "#3F6212",
        "image": "/src/assets/images/shoes/adidas-dropset-2.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-dropset-2.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-2.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-3.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-4.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-5.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-6.jpg"
        ]
      },
      {
        "name": "Solar Red / Carbon",
        "hex": "#DC2626",
        "image": "/src/assets/images/shoes/adidas-dropset-2-red.jpg",
        "images": [
          "/src/assets/images/shoes/adidas-dropset-2-red.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-red-2.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-red-3.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-red-4.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-red-5.jpg",
          "/src/assets/images/shoes/adidas-dropset-2-red-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đế bằng vững chãi tối ưu cho các bài tập tạ và rèn luyện thể lực.",
    "description": "Độ dốc gót chỉ 6mm mang lại điểm tựa thăng bằng chuẩn xác, phần đế giữa kép với EVA cứng ở gót và mềm hơn ở mũi chân hỗ trợ di chuyển linh hoạt.",
    "status": "Đang bán",
    "createdAt": "19/02/2026"
  },
  {
    "id": "puma-rsx-retro",
    "sku": "PM-RSX-31",
    "name": "Puma RS-X Retro Drift",
    "brand": "Puma",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 3400000,
    "originalPrice": 3900000,
    "image": "/src/assets/images/shoes/puma-rsx-retro.jpg",
    "images": [
      "/src/assets/images/shoes/puma-rsx-retro.jpg",
      "/src/assets/images/shoes/puma-rsx-retro-2.jpg",
      "/src/assets/images/shoes/puma-rsx-retro-3.jpg",
      "/src/assets/images/shoes/puma-rsx-retro-4.jpg",
      "/src/assets/images/shoes/puma-rsx-retro-5.jpg",
      "/src/assets/images/shoes/puma-rsx-retro-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 98,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "36": 4,
      "37": 8,
      "38": 12,
      "39": 15,
      "40": 16,
      "41": 14,
      "42": 10,
      "43": 5
    },
    "stockQuantity": 84,
    "colors": [
      {
        "name": "Retro Multi",
        "hex": "#D946EF",
        "image": "/src/assets/images/shoes/puma-rsx-retro.jpg",
        "images": [
          "/src/assets/images/shoes/puma-rsx-retro.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-2.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-3.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-4.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-5.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-6.jpg"
        ]
      },
      {
        "name": "Teal Lagoon",
        "hex": "#06B6D4",
        "image": "/src/assets/images/shoes/puma-rsx-retro-teal.jpg",
        "images": [
          "/src/assets/images/shoes/puma-rsx-retro-teal.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-teal-2.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-teal-3.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-teal-4.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-teal-5.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-teal-6.jpg"
        ]
      },
      {
        "name": "Concrete Grey",
        "hex": "#94A3B8",
        "image": "/src/assets/images/shoes/puma-rsx-retro-grey.jpg",
        "images": [
          "/src/assets/images/shoes/puma-rsx-retro-grey.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-grey-2.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-grey-3.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-grey-4.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-grey-5.jpg",
          "/src/assets/images/shoes/puma-rsx-retro-grey-6.jpg"
        ]
      }
    ],
    "shortDescription": "Thiết kế chunky hầm hố phá cách đậm chất đường phố tương lai.",
    "description": "Dòng sản phẩm RS-X đã quay trở lại với diện mạo tương lai đầy nổi loạn. Thiết kế chunky hầm hố kết hợp các mảng màu tương phản phong cách retro hoài cổ mang đến một vẻ ngoài cực kỳ thời thượng, phá cách cho các tín đồ streetwear.",
    "status": "Đang bán",
    "createdAt": "15/01/2026"
  },
  {
    "id": "puma-suede-classic",
    "sku": "PM-SUEDE-32",
    "name": "Puma Suede Classic XXI Black",
    "brand": "Puma",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2100000,
    "originalPrice": 2400000,
    "image": "/src/assets/images/shoes/puma-suede-classic.jpg",
    "images": [
      "/src/assets/images/shoes/puma-suede-classic.jpg",
      "/src/assets/images/shoes/puma-suede-classic-2.jpg",
      "/src/assets/images/shoes/puma-suede-classic-3.jpg",
      "/src/assets/images/shoes/puma-suede-classic-4.jpg",
      "/src/assets/images/shoes/puma-suede-classic-5.jpg",
      "/src/assets/images/shoes/puma-suede-classic-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 230,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "37": 6,
      "38": 10,
      "39": 14,
      "40": 18,
      "41": 15,
      "42": 12,
      "43": 6
    },
    "stockQuantity": 81,
    "colors": [
      {
        "name": "Black / White Formstrip",
        "hex": "#18181B",
        "image": "/src/assets/images/shoes/puma-suede-classic.jpg",
        "images": [
          "/src/assets/images/shoes/puma-suede-classic.jpg",
          "/src/assets/images/shoes/puma-suede-classic-2.jpg",
          "/src/assets/images/shoes/puma-suede-classic-3.jpg",
          "/src/assets/images/shoes/puma-suede-classic-4.jpg",
          "/src/assets/images/shoes/puma-suede-classic-5.jpg",
          "/src/assets/images/shoes/puma-suede-classic-6.jpg"
        ]
      },
      {
        "name": "Pez Red / White",
        "hex": "#DC2626",
        "image": "/src/assets/images/shoes/puma-suede-classic-red.jpg",
        "images": [
          "/src/assets/images/shoes/puma-suede-classic-red.jpg",
          "/src/assets/images/shoes/puma-suede-classic-red-2.jpg",
          "/src/assets/images/shoes/puma-suede-classic-red-3.jpg",
          "/src/assets/images/shoes/puma-suede-classic-red-4.jpg",
          "/src/assets/images/shoes/puma-suede-classic-red-5.jpg",
          "/src/assets/images/shoes/puma-suede-classic-red-6.jpg"
        ]
      }
    ],
    "shortDescription": "Huyền thoại da lộn từ năm 1968 đồng hành cùng các thế hệ b-boy.",
    "description": "Một biểu tượng bất tử đã xuất hiện từ năm 1968. Toàn bộ thân giày làm từ da lộn cao cấp, đường Formstrip mềm mại và logo Puma ánh kim vàng sang trọng.",
    "status": "Đang bán",
    "createdAt": "18/01/2026"
  },
  {
    "id": "puma-palermo-og",
    "sku": "PM-PAL-33",
    "name": "Puma Palermo Special Navy",
    "brand": "Puma",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2450000,
    "image": "/src/assets/images/shoes/puma-palermo-og.jpg",
    "images": [
      "/src/assets/images/shoes/puma-palermo-og.jpg",
      "/src/assets/images/shoes/puma-palermo-og-2.jpg",
      "/src/assets/images/shoes/puma-palermo-og-3.jpg",
      "/src/assets/images/shoes/puma-palermo-og-4.jpg",
      "/src/assets/images/shoes/puma-palermo-og-5.jpg",
      "/src/assets/images/shoes/puma-palermo-og-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 115,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42
    ],
    "sizeStock": {
      "36": 5,
      "37": 8,
      "38": 12,
      "39": 16,
      "40": 15,
      "41": 10,
      "42": 6
    },
    "stockQuantity": 72,
    "colors": [
      {
        "name": "Navy / White Gum",
        "hex": "#1E3A8A",
        "image": "/src/assets/images/shoes/puma-palermo-og.jpg",
        "images": [
          "/src/assets/images/shoes/puma-palermo-og.jpg",
          "/src/assets/images/shoes/puma-palermo-og-2.jpg",
          "/src/assets/images/shoes/puma-palermo-og-3.jpg",
          "/src/assets/images/shoes/puma-palermo-og-4.jpg",
          "/src/assets/images/shoes/puma-palermo-og-5.jpg",
          "/src/assets/images/shoes/puma-palermo-og-6.jpg"
        ]
      },
      {
        "name": "Mint Green / Pink",
        "hex": "#10B981",
        "image": "/src/assets/images/shoes/puma-palermo-og-mint.jpg",
        "images": [
          "/src/assets/images/shoes/puma-palermo-og-mint.jpg",
          "/src/assets/images/shoes/puma-palermo-og-mint-2.jpg",
          "/src/assets/images/shoes/puma-palermo-og-mint-3.jpg",
          "/src/assets/images/shoes/puma-palermo-og-mint-4.jpg",
          "/src/assets/images/shoes/puma-palermo-og-mint-5.jpg",
          "/src/assets/images/shoes/puma-palermo-og-mint-6.jpg"
        ]
      }
    ],
    "shortDescription": "Cảm hứng từ hòn đảo Sicily nước Ý với tag thương hiệu độc bản.",
    "description": "Puma Palermo ban đầu ra mắt tại các khán đài bóng đá thập niên 80. Mũi giày chữ T bọc da lộn, đế cao su cổ điển và nhãn vải Palermo đặc trưng bên hông.",
    "status": "Đang bán",
    "createdAt": "21/01/2026"
  },
  {
    "id": "puma-cali-court",
    "sku": "PM-CALI-34",
    "name": "Puma Cali Court Match Leather",
    "brand": "Puma",
    "category": "Giày lifestyle",
    "gender": "Nữ",
    "price": 2250000,
    "image": "/src/assets/images/shoes/puma-cali-court.jpg",
    "images": [
      "/src/assets/images/shoes/puma-cali-court.jpg",
      "/src/assets/images/shoes/puma-cali-court-2.jpg",
      "/src/assets/images/shoes/puma-cali-court-3.jpg",
      "/src/assets/images/shoes/puma-cali-court-4.jpg",
      "/src/assets/images/shoes/puma-cali-court-5.jpg",
      "/src/assets/images/shoes/puma-cali-court-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 88,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40
    ],
    "sizeStock": {
      "36": 8,
      "37": 12,
      "38": 15,
      "39": 10,
      "40": 5
    },
    "stockQuantity": 50,
    "colors": [
      {
        "name": "Puma White / Gold",
        "hex": "#FEF3C7",
        "image": "/src/assets/images/shoes/puma-cali-court.jpg",
        "images": [
          "/src/assets/images/shoes/puma-cali-court.jpg",
          "/src/assets/images/shoes/puma-cali-court-2.jpg",
          "/src/assets/images/shoes/puma-cali-court-3.jpg",
          "/src/assets/images/shoes/puma-cali-court-4.jpg",
          "/src/assets/images/shoes/puma-cali-court-5.jpg",
          "/src/assets/images/shoes/puma-cali-court-6.jpg"
        ]
      },
      {
        "name": "White / Rose Pink",
        "hex": "#F472B6",
        "image": "/src/assets/images/shoes/puma-cali-court-pink.jpg",
        "images": [
          "/src/assets/images/shoes/puma-cali-court-pink.jpg",
          "/src/assets/images/shoes/puma-cali-court-pink-2.jpg",
          "/src/assets/images/shoes/puma-cali-court-pink-3.jpg",
          "/src/assets/images/shoes/puma-cali-court-pink-4.jpg",
          "/src/assets/images/shoes/puma-cali-court-pink-5.jpg",
          "/src/assets/images/shoes/puma-cali-court-pink-6.jpg"
        ]
      }
    ],
    "shortDescription": "Phong cách bờ biển California năng động, thanh lịch cho phái nữ.",
    "description": "Dành cho các cô nàng yêu thích phong cách tối giản và dễ thương. Đế platform hơi đôn nhẹ giúp hack dáng tự nhiên khi phối cùng chân váy hay quần jeans.",
    "status": "Đang bán",
    "createdAt": "24/01/2026"
  },
  {
    "id": "puma-slipstream-bball",
    "sku": "PM-SLIP-35",
    "name": "Puma Slipstream Lo Retro",
    "brand": "Puma",
    "category": "Sneaker",
    "gender": "Nam",
    "price": 2600000,
    "image": "/src/assets/images/shoes/puma-slipstream-bball.jpg",
    "images": [
      "/src/assets/images/shoes/puma-slipstream-bball.jpg",
      "/src/assets/images/shoes/puma-slipstream-bball-2.jpg",
      "/src/assets/images/shoes/puma-slipstream-bball-3.jpg",
      "/src/assets/images/shoes/puma-slipstream-bball-4.jpg",
      "/src/assets/images/shoes/puma-slipstream-bball-5.jpg",
      "/src/assets/images/shoes/puma-slipstream-bball-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 94,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 5,
      "40": 10,
      "41": 14,
      "42": 12,
      "43": 6
    },
    "stockQuantity": 47,
    "colors": [
      {
        "name": "White / Amazon Green",
        "hex": "#166534",
        "image": "/src/assets/images/shoes/puma-slipstream-bball.jpg",
        "images": [
          "/src/assets/images/shoes/puma-slipstream-bball.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-2.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-3.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-4.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-5.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-6.jpg"
        ]
      },
      {
        "name": "White / Retro Blue",
        "hex": "#2563EB",
        "image": "/src/assets/images/shoes/puma-slipstream-bball-blue.jpg",
        "images": [
          "/src/assets/images/shoes/puma-slipstream-bball-blue.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-blue-2.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-blue-3.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-blue-4.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-blue-5.jpg",
          "/src/assets/images/shoes/puma-slipstream-bball-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Mẫu giày bóng rổ cổ thấp đậm nét hoài cổ thập niên 80.",
    "description": "Slipstream xuất hiện lần đầu năm 1987 và trở thành di sản của Puma. Da cao cấp, lớp lót êm ái và chi tiết phối màu tương phản tinh tế.",
    "status": "Đang bán",
    "createdAt": "27/01/2026"
  },
  {
    "id": "puma-velocity-nitro",
    "sku": "PM-VNITRO-36",
    "name": "Puma Velocity Nitro 3",
    "brand": "Puma",
    "category": "Giày chạy bộ",
    "gender": "Nam",
    "price": 3300000,
    "originalPrice": 3700000,
    "image": "/src/assets/images/shoes/puma-velocity-nitro.jpg",
    "images": [
      "/src/assets/images/shoes/puma-velocity-nitro.jpg",
      "/src/assets/images/shoes/puma-velocity-nitro-2.jpg",
      "/src/assets/images/shoes/puma-velocity-nitro-3.jpg",
      "/src/assets/images/shoes/puma-velocity-nitro-4.jpg",
      "/src/assets/images/shoes/puma-velocity-nitro-5.jpg",
      "/src/assets/images/shoes/puma-velocity-nitro-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 104,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0
    },
    "stockQuantity": 0,
    "colors": [
      {
        "name": "Fireglow / Electric Lime",
        "hex": "#84CC16",
        "image": "/src/assets/images/shoes/puma-velocity-nitro.jpg",
        "images": [
          "/src/assets/images/shoes/puma-velocity-nitro.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-2.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-3.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-4.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-5.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-6.jpg"
        ]
      },
      {
        "name": "Sunset Coral / Black",
        "hex": "#F43F5E",
        "image": "/src/assets/images/shoes/puma-velocity-nitro-coral.jpg",
        "images": [
          "/src/assets/images/shoes/puma-velocity-nitro-coral.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-coral-2.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-coral-3.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-coral-4.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-coral-5.jpg",
          "/src/assets/images/shoes/puma-velocity-nitro-coral-6.jpg"
        ]
      }
    ],
    "shortDescription": "Bọt NITRO êm ái đàn hồi cùng đế bám PUMAGRIP siêu dính.",
    "description": "Được giới chạy bộ đánh giá là đôi giày tập luyện hàng ngày tốt bậc nhất phân khúc nhờ công nghệ bọt khí NITRO siêu nhẹ và đế ngoài cao su PUMAGRIP bền bỉ trên mọi địa hình.",
    "status": "Ngừng kinh doanh",
    "createdAt": "30/01/2026"
  },
  {
    "id": "puma-deviate-nitro-2",
    "sku": "PM-DEV-37",
    "name": "Puma Deviate Nitro 2 Carbon",
    "brand": "Puma",
    "category": "Giày chạy bộ",
    "gender": "Unisex",
    "price": 4500000,
    "image": "/src/assets/images/shoes/puma-deviate-nitro-2.jpg",
    "images": [
      "/src/assets/images/shoes/puma-deviate-nitro-2.jpg",
      "/src/assets/images/shoes/puma-deviate-nitro-2-2.jpg",
      "/src/assets/images/shoes/puma-deviate-nitro-2-3.jpg",
      "/src/assets/images/shoes/puma-deviate-nitro-2-4.jpg",
      "/src/assets/images/shoes/puma-deviate-nitro-2-5.jpg",
      "/src/assets/images/shoes/puma-deviate-nitro-2-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 86,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "40": 6,
      "41": 10,
      "42": 12,
      "43": 6
    },
    "stockQuantity": 34,
    "colors": [
      {
        "name": "Sun Stream / Orange",
        "hex": "#F97316",
        "image": "/src/assets/images/shoes/puma-deviate-nitro-2.jpg",
        "images": [
          "/src/assets/images/shoes/puma-deviate-nitro-2.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-2.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-3.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-4.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-5.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-6.jpg"
        ]
      },
      {
        "name": "Electric Cyan / Aqua",
        "hex": "#0284C7",
        "image": "/src/assets/images/shoes/puma-deviate-nitro-2-cyan.jpg",
        "images": [
          "/src/assets/images/shoes/puma-deviate-nitro-2-cyan.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-cyan-2.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-cyan-3.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-cyan-4.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-cyan-5.jpg",
          "/src/assets/images/shoes/puma-deviate-nitro-2-cyan-6.jpg"
        ]
      }
    ],
    "shortDescription": "Trang bị đĩa carbon INNOPLATE mang lại lực phóng tối đa khi chạy nhanh.",
    "description": "Deviate Nitro 2 là bước đột phá đưa công nghệ đĩa đệm carbon đến gần hơn với runner phong trào, vừa trợ lực tốt vừa giữ được độ êm ái bảo vệ cơ thể.",
    "status": "Đang bán",
    "createdAt": "03/02/2026"
  },
  {
    "id": "puma-magnify-nitro-2",
    "sku": "PM-MAG-38",
    "name": "Puma Magnify Nitro 2 Max Cushion",
    "brand": "Puma",
    "category": "Giày chạy bộ",
    "gender": "Nữ",
    "price": 3800000,
    "image": "/src/assets/images/shoes/puma-magnify-nitro-2.jpg",
    "images": [
      "/src/assets/images/shoes/puma-magnify-nitro-2.jpg",
      "/src/assets/images/shoes/puma-magnify-nitro-2-2.jpg",
      "/src/assets/images/shoes/puma-magnify-nitro-2-3.jpg",
      "/src/assets/images/shoes/puma-magnify-nitro-2-4.jpg",
      "/src/assets/images/shoes/puma-magnify-nitro-2-5.jpg",
      "/src/assets/images/shoes/puma-magnify-nitro-2-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 72,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40
    ],
    "sizeStock": {
      "36": 6,
      "37": 10,
      "38": 14,
      "39": 8,
      "40": 4
    },
    "stockQuantity": 42,
    "colors": [
      {
        "name": "Peach Fizz / Gold",
        "hex": "#FDBA74",
        "image": "/src/assets/images/shoes/puma-magnify-nitro-2.jpg",
        "images": [
          "/src/assets/images/shoes/puma-magnify-nitro-2.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-2.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-3.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-4.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-5.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-6.jpg"
        ]
      },
      {
        "name": "Royal Cobalt Blue",
        "hex": "#2563EB",
        "image": "/src/assets/images/shoes/puma-magnify-nitro-2-blue.jpg",
        "images": [
          "/src/assets/images/shoes/puma-magnify-nitro-2-blue.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-blue-2.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-blue-3.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-blue-4.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-blue-5.jpg",
          "/src/assets/images/shoes/puma-magnify-nitro-2-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Lớp đệm NITRO dày nhất của Puma dành cho các bài chạy hồi phục nhẹ nhàng.",
    "description": "Nếu bạn tìm kiếm sự nâng niu tối thượng sau những giờ làm việc mệt mỏi hay những bài chạy căng thẳng, Magnify Nitro 2 chính là sự lựa chọn không thể thay thế.",
    "status": "Đang bán",
    "createdAt": "06/02/2026"
  },
  {
    "id": "puma-future-7-ultimate",
    "sku": "PM-FUT7-39",
    "name": "Puma Future 7 Ultimate FG/AG",
    "brand": "Puma",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 5600000,
    "image": "/src/assets/images/shoes/puma-future-7-ultimate.jpg",
    "images": [
      "/src/assets/images/shoes/puma-future-7-ultimate.jpg",
      "/src/assets/images/shoes/puma-future-7-ultimate-2.jpg",
      "/src/assets/images/shoes/puma-future-7-ultimate-3.jpg",
      "/src/assets/images/shoes/puma-future-7-ultimate-4.jpg",
      "/src/assets/images/shoes/puma-future-7-ultimate-5.jpg",
      "/src/assets/images/shoes/puma-future-7-ultimate-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 118,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 5,
      "40": 8,
      "41": 12,
      "42": 10,
      "43": 5
    },
    "stockQuantity": 40,
    "colors": [
      {
        "name": "Bluemazing / Poison Pink",
        "hex": "#0284C7",
        "image": "/src/assets/images/shoes/puma-future-7-ultimate.jpg",
        "images": [
          "/src/assets/images/shoes/puma-future-7-ultimate.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-2.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-3.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-4.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-5.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-6.jpg"
        ]
      },
      {
        "name": "Poison Volt / Green",
        "hex": "#84CC16",
        "image": "/src/assets/images/shoes/puma-future-7-ultimate-volt.jpg",
        "images": [
          "/src/assets/images/shoes/puma-future-7-ultimate-volt.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-volt-2.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-volt-3.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-volt-4.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-volt-5.jpg",
          "/src/assets/images/shoes/puma-future-7-ultimate-volt-6.jpg"
        ]
      }
    ],
    "shortDescription": "Công nghệ dải trợ lực PWRTAPE ôm chân hoàn hảo của Neymar Jr.",
    "description": "Thân giày Fuzionfit360 kết hợp dải khóa PWRTAPE thế hệ mới mang lại sự tự do tối đa cho các nghệ sĩ sân cỏ thỏa sức sáng tạo không giới hạn.",
    "status": "Đang bán",
    "createdAt": "09/02/2026"
  },
  {
    "id": "puma-ultra-match-tf",
    "sku": "PM-ULTRA-40",
    "name": "Puma Ultra Match TF Fast Yellow",
    "brand": "Puma",
    "category": "Giày bóng đá",
    "gender": "Nam",
    "price": 2100000,
    "originalPrice": 2400000,
    "image": "/src/assets/images/shoes/puma-ultra-match-tf.jpg",
    "images": [
      "/src/assets/images/shoes/puma-ultra-match-tf.jpg",
      "/src/assets/images/shoes/puma-ultra-match-tf-2.jpg",
      "/src/assets/images/shoes/puma-ultra-match-tf-3.jpg",
      "/src/assets/images/shoes/puma-ultra-match-tf-4.jpg",
      "/src/assets/images/shoes/puma-ultra-match-tf-5.jpg",
      "/src/assets/images/shoes/puma-ultra-match-tf-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 78,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 6,
      "40": 10,
      "41": 14,
      "42": 12,
      "43": 6
    },
    "stockQuantity": 48,
    "colors": [
      {
        "name": "Poison Yellow",
        "hex": "#EAB308",
        "image": "/src/assets/images/shoes/puma-ultra-match-tf.jpg",
        "images": [
          "/src/assets/images/shoes/puma-ultra-match-tf.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-2.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-3.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-4.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-5.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-6.jpg"
        ]
      },
      {
        "name": "Electric Magenta",
        "hex": "#D946EF",
        "image": "/src/assets/images/shoes/puma-ultra-match-tf-magenta.jpg",
        "images": [
          "/src/assets/images/shoes/puma-ultra-match-tf-magenta.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-magenta-2.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-magenta-3.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-magenta-4.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-magenta-5.jpg",
          "/src/assets/images/shoes/puma-ultra-match-tf-magenta-6.jpg"
        ]
      }
    ],
    "shortDescription": "Cực nhẹ, thanh thoát dành cho các máy chạy cánh trên sân cỏ nhân tạo.",
    "description": "Phần thân lưới phủ lớp màng GripControl giúp tăng cường kiểm soát bóng trong những tình huống tăng tốc đoạn ngắn đầy uy lực.",
    "status": "Đang bán",
    "createdAt": "12/02/2026"
  },
  {
    "id": "converse-chuck-70",
    "sku": "CV-C70-41",
    "name": "Converse Chuck Taylor '70 Vintage Black",
    "brand": "Converse",
    "category": "Giày lifestyle",
    "gender": "Unisex",
    "price": 2100000,
    "image": "/src/assets/images/shoes/converse-chuck-70.jpg",
    "images": [
      "/src/assets/images/shoes/converse-chuck-70.jpg",
      "/src/assets/images/shoes/converse-chuck-70-2.jpg",
      "/src/assets/images/shoes/converse-chuck-70-3.jpg",
      "/src/assets/images/shoes/converse-chuck-70-4.jpg",
      "/src/assets/images/shoes/converse-chuck-70-5.jpg",
      "/src/assets/images/shoes/converse-chuck-70-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 512,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "36": 8,
      "37": 12,
      "38": 15,
      "39": 20,
      "40": 25,
      "41": 22,
      "42": 16,
      "43": 10
    },
    "stockQuantity": 128,
    "colors": [
      {
        "name": "Vintage Black",
        "hex": "#1C1917",
        "image": "/src/assets/images/shoes/converse-chuck-70.jpg",
        "images": [
          "/src/assets/images/shoes/converse-chuck-70.jpg",
          "/src/assets/images/shoes/converse-chuck-70-2.jpg",
          "/src/assets/images/shoes/converse-chuck-70-3.jpg",
          "/src/assets/images/shoes/converse-chuck-70-4.jpg",
          "/src/assets/images/shoes/converse-chuck-70-5.jpg",
          "/src/assets/images/shoes/converse-chuck-70-6.jpg"
        ]
      },
      {
        "name": "Parchment Cream",
        "hex": "#FEF3C7",
        "image": "/src/assets/images/shoes/converse-chuck-70-parchment.jpg",
        "images": [
          "/src/assets/images/shoes/converse-chuck-70-parchment.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-2.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-3.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-4.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-5.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-6.jpg"
        ]
      }
    ],
    "shortDescription": "Vải canvas dày dặn 12oz cùng lót đệm OrthoLite êm ái vượt trội.",
    "description": "Mẫu giày sneaker kinh điển không bao giờ lỗi mốt. Converse Chuck 70 tinh chỉnh lại các chi tiết từ phiên bản thập niên 1970 với chất liệu canvas dày dặn cao cấp, đế cao su bóng bẩy và lớp lót đệm OrthoLite êm ái hơn bao giờ hết.",
    "status": "Đang bán",
    "createdAt": "15/01/2026"
  },
  {
    "id": "converse-all-star-classic",
    "sku": "CV-ALL-42",
    "name": "Converse Chuck Taylor All Star Classic High",
    "brand": "Converse",
    "category": "Giày lifestyle",
    "gender": "Unisex",
    "price": 1650000,
    "originalPrice": 1850000,
    "image": "/src/assets/images/shoes/converse-all-star-classic.jpg",
    "images": [
      "/src/assets/images/shoes/converse-all-star-classic.jpg",
      "/src/assets/images/shoes/converse-all-star-classic-2.jpg",
      "/src/assets/images/shoes/converse-all-star-classic-3.jpg",
      "/src/assets/images/shoes/converse-all-star-classic-4.jpg",
      "/src/assets/images/shoes/converse-all-star-classic-5.jpg",
      "/src/assets/images/shoes/converse-all-star-classic-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 340,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42
    ],
    "sizeStock": {
      "36": 10,
      "37": 15,
      "38": 20,
      "39": 22,
      "40": 20,
      "41": 15,
      "42": 8
    },
    "stockQuantity": 110,
    "colors": [
      {
        "name": "Classic Optical White",
        "hex": "#FFFFFF",
        "image": "/src/assets/images/shoes/converse-all-star-classic.jpg",
        "images": [
          "/src/assets/images/shoes/converse-all-star-classic.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-2.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-3.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-4.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-5.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-6.jpg"
        ]
      },
      {
        "name": "Classic Canvas Red",
        "hex": "#DC2626",
        "image": "/src/assets/images/shoes/converse-all-star-classic-red.jpg",
        "images": [
          "/src/assets/images/shoes/converse-all-star-classic-red.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-red-2.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-red-3.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-red-4.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-red-5.jpg",
          "/src/assets/images/shoes/converse-all-star-classic-red-6.jpg"
        ]
      }
    ],
    "shortDescription": "Mẫu giày cổ cao quốc dân gắn liền với tuổi trẻ của mọi thế hệ.",
    "description": "Ra đời hơn 100 năm trước, Chuck Taylor All Star là đôi giày có độ nhận diện cao bậc nhất hành tinh. Đơn giản, bền bỉ và cực kỳ dễ phối đồ.",
    "status": "Đang bán",
    "createdAt": "17/01/2026"
  },
  {
    "id": "converse-run-star-hike",
    "sku": "CV-HIKE-43",
    "name": "Converse Run Star Hike Platform",
    "brand": "Converse",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2800000,
    "image": "/src/assets/images/shoes/converse-run-star-hike.jpg",
    "images": [
      "/src/assets/images/shoes/converse-run-star-hike.jpg",
      "/src/assets/images/shoes/converse-run-star-hike-2.jpg",
      "/src/assets/images/shoes/converse-run-star-hike-3.jpg",
      "/src/assets/images/shoes/converse-run-star-hike-4.jpg",
      "/src/assets/images/shoes/converse-run-star-hike-5.jpg",
      "/src/assets/images/shoes/converse-run-star-hike-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 220,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41
    ],
    "sizeStock": {
      "36": 8,
      "37": 14,
      "38": 18,
      "39": 15,
      "40": 10,
      "41": 6
    },
    "stockQuantity": 71,
    "colors": [
      {
        "name": "Black / White / Gum",
        "hex": "#111827",
        "image": "/src/assets/images/shoes/converse-run-star-hike.jpg",
        "images": [
          "/src/assets/images/shoes/converse-run-star-hike.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-2.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-3.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-4.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-5.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-6.jpg"
        ]
      },
      {
        "name": "Sand Tan / Parchment",
        "hex": "#D97706",
        "image": "/src/assets/images/shoes/converse-run-star-hike-tan.jpg",
        "images": [
          "/src/assets/images/shoes/converse-run-star-hike-tan.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-tan-2.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-tan-3.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-tan-4.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-tan-5.jpg",
          "/src/assets/images/shoes/converse-run-star-hike-tan-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đế răng cưa hầm hố phá vỡ mọi quy chuẩn truyền thống.",
    "description": "Thiết kế đế chunky bánh mì kết hợp răng cưa ziczac hai màu mang lại vẻ đẹp vị lai cá tính, đồng thời tôn chiều cao thêm 5cm đầy tự nhiên.",
    "status": "Đang bán",
    "createdAt": "20/01/2026"
  },
  {
    "id": "converse-one-star-pro",
    "sku": "CV-ONESTAR-44",
    "name": "Converse One Star Pro Suede",
    "brand": "Converse",
    "category": "Sneaker",
    "gender": "Unisex",
    "price": 2300000,
    "image": "/src/assets/images/shoes/converse-one-star-pro.jpg",
    "images": [
      "/src/assets/images/shoes/converse-one-star-pro.jpg",
      "/src/assets/images/shoes/converse-one-star-pro-2.jpg",
      "/src/assets/images/shoes/converse-one-star-pro-3.jpg",
      "/src/assets/images/shoes/converse-one-star-pro-4.jpg",
      "/src/assets/images/shoes/converse-one-star-pro-5.jpg",
      "/src/assets/images/shoes/converse-one-star-pro-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 95,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      38,
      39,
      40,
      41,
      42
    ],
    "sizeStock": {
      "38": 6,
      "39": 10,
      "40": 14,
      "41": 12,
      "42": 6
    },
    "stockQuantity": 48,
    "colors": [
      {
        "name": "Vintage Navy / White",
        "hex": "#1E3A8A",
        "image": "/src/assets/images/shoes/converse-one-star-pro.jpg",
        "images": [
          "/src/assets/images/shoes/converse-one-star-pro.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-2.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-3.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-4.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-5.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-6.jpg"
        ]
      },
      {
        "name": "Forest Green Suede",
        "hex": "#15803D",
        "image": "/src/assets/images/shoes/converse-one-star-pro-green.jpg",
        "images": [
          "/src/assets/images/shoes/converse-one-star-pro-green.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-green-2.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-green-3.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-green-4.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-green-5.jpg",
          "/src/assets/images/shoes/converse-one-star-pro-green-6.jpg"
        ]
      }
    ],
    "shortDescription": "Họa tiết ngôi sao đơn độc bằng da lộn cao cấp đậm chất trượt ván.",
    "description": "Dành riêng cho cộng đồng skateboarding với lớp lót đệm bọt CX giảm chấn và chất da lộn gia cố bền bỉ trước mọi ma sát.",
    "status": "Đang bán",
    "createdAt": "23/01/2026"
  },
  {
    "id": "converse-chuck-70-parchment",
    "sku": "CV-PARCH-45",
    "name": "Converse Chuck 70 High Top Parchment",
    "brand": "Converse",
    "category": "Giày lifestyle",
    "gender": "Unisex",
    "price": 2200000,
    "originalPrice": 2450000,
    "image": "/src/assets/images/shoes/converse-chuck-70-parchment.jpg",
    "images": [
      "/src/assets/images/shoes/converse-chuck-70-parchment.jpg",
      "/src/assets/images/shoes/converse-chuck-70-parchment-2.jpg",
      "/src/assets/images/shoes/converse-chuck-70-parchment-3.jpg",
      "/src/assets/images/shoes/converse-chuck-70-parchment-4.jpg",
      "/src/assets/images/shoes/converse-chuck-70-parchment-5.jpg",
      "/src/assets/images/shoes/converse-chuck-70-parchment-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 175,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42
    ],
    "sizeStock": {
      "36": 6,
      "37": 10,
      "38": 15,
      "39": 18,
      "40": 14,
      "41": 10,
      "42": 6
    },
    "stockQuantity": 79,
    "colors": [
      {
        "name": "Parchment White Cream",
        "hex": "#FEF3C7",
        "image": "/src/assets/images/shoes/converse-chuck-70-parchment.jpg",
        "images": [
          "/src/assets/images/shoes/converse-chuck-70-parchment.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-2.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-3.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-4.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-5.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-6.jpg"
        ]
      },
      {
        "name": "Vintage Olive Green",
        "hex": "#4D7C0F",
        "image": "/src/assets/images/shoes/converse-chuck-70-parchment-olive.jpg",
        "images": [
          "/src/assets/images/shoes/converse-chuck-70-parchment-olive.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-olive-2.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-olive-3.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-olive-4.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-olive-5.jpg",
          "/src/assets/images/shoes/converse-chuck-70-parchment-olive-6.jpg"
        ]
      }
    ],
    "shortDescription": "Sắc kem cổ điển ấm áp, biểu tượng thời trang vintage tinh tế.",
    "description": "Màu Parchment trắng ngà kết hợp đường chỉ may tỉ mỉ hai bên hông và đế cao su phủ bóng ngả màu thời gian tạo nên chất nghệ sĩ rất riêng.",
    "status": "Đang bán",
    "createdAt": "26/01/2026"
  },
  {
    "id": "converse-all-star-move",
    "sku": "CV-MOVE-46",
    "name": "Converse Chuck Taylor All Star Move Light",
    "brand": "Converse",
    "category": "Giày lifestyle",
    "gender": "Nữ",
    "price": 2450000,
    "image": "/src/assets/images/shoes/converse-all-star-move.jpg",
    "images": [
      "/src/assets/images/shoes/converse-all-star-move.jpg",
      "/src/assets/images/shoes/converse-all-star-move-2.jpg",
      "/src/assets/images/shoes/converse-all-star-move-3.jpg",
      "/src/assets/images/shoes/converse-all-star-move-4.jpg",
      "/src/assets/images/shoes/converse-all-star-move-5.jpg",
      "/src/assets/images/shoes/converse-all-star-move-6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 84,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      35,
      36,
      37,
      38,
      39
    ],
    "sizeStock": {
      "35": 4,
      "36": 8,
      "37": 12,
      "38": 10,
      "39": 6
    },
    "stockQuantity": 40,
    "colors": [
      {
        "name": "Egret / Pastel Pink",
        "hex": "#FCE7F3",
        "image": "/src/assets/images/shoes/converse-all-star-move.jpg",
        "images": [
          "/src/assets/images/shoes/converse-all-star-move.jpg",
          "/src/assets/images/shoes/converse-all-star-move-2.jpg",
          "/src/assets/images/shoes/converse-all-star-move-3.jpg",
          "/src/assets/images/shoes/converse-all-star-move-4.jpg",
          "/src/assets/images/shoes/converse-all-star-move-5.jpg",
          "/src/assets/images/shoes/converse-all-star-move-6.jpg"
        ]
      },
      {
        "name": "Cloud White / Sky Blue",
        "hex": "#93C5FD",
        "image": "/src/assets/images/shoes/converse-all-star-move-blue.jpg",
        "images": [
          "/src/assets/images/shoes/converse-all-star-move-blue.jpg",
          "/src/assets/images/shoes/converse-all-star-move-blue-2.jpg",
          "/src/assets/images/shoes/converse-all-star-move-blue-3.jpg",
          "/src/assets/images/shoes/converse-all-star-move-blue-4.jpg",
          "/src/assets/images/shoes/converse-all-star-move-blue-5.jpg",
          "/src/assets/images/shoes/converse-all-star-move-blue-6.jpg"
        ]
      }
    ],
    "shortDescription": "Đế đôn siêu nhẹ với đường lượn sóng điệu đà dành cho phái đẹp.",
    "description": "Đột phá trọng lượng với công nghệ đệm đúc nguyên khối siêu nhẹ, giúp các bạn nữ di chuyển thanh thoát cả ngày mà không hề nặng chân.",
    "status": "Đang bán",
    "createdAt": "29/01/2026"
  },
  {
    "id": "converse-weapon-ox",
    "sku": "CV-WEAPON-47",
    "name": "Converse Weapon Ox Vintage White",
    "brand": "Converse",
    "category": "Sneaker",
    "gender": "Nam",
    "price": 3100000,
    "image": "/src/assets/images/shoes/converse-weapon-ox.jpg",
    "images": [
      "/src/assets/images/shoes/converse-weapon-ox.jpg",
      "/src/assets/images/shoes/converse-weapon-ox-2.jpg",
      "/src/assets/images/shoes/converse-weapon-ox-3.jpg",
      "/src/assets/images/shoes/converse-weapon-ox-4.jpg",
      "/src/assets/images/shoes/converse-weapon-ox-5.jpg",
      "/src/assets/images/shoes/converse-weapon-ox-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 65,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 5,
      "40": 8,
      "41": 12,
      "42": 10,
      "43": 5
    },
    "stockQuantity": 40,
    "colors": [
      {
        "name": "White / Vintage Purple",
        "hex": "#581C87",
        "image": "/src/assets/images/shoes/converse-weapon-ox.jpg",
        "images": [
          "/src/assets/images/shoes/converse-weapon-ox.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-2.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-3.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-4.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-5.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-6.jpg"
        ]
      },
      {
        "name": "White / Varsity Green",
        "hex": "#15803D",
        "image": "/src/assets/images/shoes/converse-weapon-ox-green.jpg",
        "images": [
          "/src/assets/images/shoes/converse-weapon-ox-green.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-green-2.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-green-3.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-green-4.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-green-5.jpg",
          "/src/assets/images/shoes/converse-weapon-ox-green-6.jpg"
        ]
      }
    ],
    "shortDescription": "Sự trở lại của chiến hài bóng rổ danh tiếng từ thập niên 80.",
    "description": "Mẫu giày từng được những huyền thoại NBA diện trên sàn đấu nay trở lại với da thật dập vân sắc sảo và form dáng low-top đường phố hiện đại.",
    "status": "Đang bán",
    "createdAt": "01/02/2026"
  },
  {
    "id": "acc-flat-shoelaces-classic",
    "sku": "ACC-LACE-53",
    "name": "Dây Giày Sneaker Bản Dẹt 8mm Cotton Cao Cấp (120cm - 140cm)",
    "brand": "K-NICKS",
    "category": "Dây giày",
    "gender": "Unisex",
    "price": 45000,
    "image": "/src/assets/images/flat_cotton_shoelaces.jpg",
    "images": [
      "/src/assets/images/flat_cotton_shoelaces.jpg",
      "/src/assets/images/flat_cotton_shoelaces_2.jpg",
      "/src/assets/images/flat_cotton_shoelaces_3.jpg",
      "/src/assets/images/flat_cotton_shoelaces_4.jpg",
      "/src/assets/images/flat_cotton_shoelaces_5.jpg",
      "/src/assets/images/flat_cotton_shoelaces_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 210,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 250,
    "colors": [],
    "shortDescription": "Dây dệt cotton mềm mịn, chống bai nhão, chuẩn độ dài cho sneaker.",
    "description": "Chất liệu sợi cotton dệt dày dặn chống tưa, đầu bọc nhựa nhiệt chắc chắn. Phù hợp hoàn hảo để thay thế hoặc custom dây giày cho Air Force 1, Jordan 1, Samba, Stan Smith.",
    "status": "Đang bán",
    "createdAt": "15/01/2026"
  },
  {
    "id": "acc-3m-reflective-laces",
    "sku": "ACC-3M-54",
    "name": "Dây Giày Tròn Phản Quang 3M Siêu Sáng (120cm)",
    "brand": "K-NICKS",
    "category": "Dây giày",
    "gender": "Unisex",
    "price": 85000,
    "originalPrice": 110000,
    "image": "/src/assets/images/reflective_3m_laces.jpg",
    "images": [
      "/src/assets/images/reflective_3m_laces.jpg",
      "/src/assets/images/reflective_3m_laces_2.jpg",
      "/src/assets/images/reflective_3m_laces_3.jpg",
      "/src/assets/images/reflective_3m_laces_4.jpg",
      "/src/assets/images/reflective_3m_laces_5.jpg",
      "/src/assets/images/reflective_3m_laces_6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 160,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 180,
    "colors": [],
    "shortDescription": "Phát sáng nổi bật khi có ánh đèn rọi vào ban đêm, cá tính và an toàn.",
    "description": "Sợi phản quang 3M Scotchlite cao cấp được đan xen kẽ vào thân dây, tạo hiệu ứng phát sáng lấp lánh cực ngầu khi chụp ảnh flash hoặc chạy bộ ban đêm.",
    "status": "Đang bán",
    "createdAt": "18/01/2026"
  },
  {
    "id": "acc-waxed-leather-laces",
    "sku": "ACC-WAX-55",
    "name": "Dây Giày Sáp Waxed Chống Nước Cho Giày Da & Sneaker Cổ Cao",
    "brand": "K-NICKS",
    "category": "Dây giày",
    "gender": "Unisex",
    "price": 95000,
    "image": "/src/assets/images/waxed_leather_laces.jpg",
    "images": [
      "/src/assets/images/waxed_leather_laces.jpg",
      "/src/assets/images/waxed_leather_laces_2.jpg",
      "/src/assets/images/waxed_leather_laces_3.jpg",
      "/src/assets/images/waxed_leather_laces_4.jpg",
      "/src/assets/images/waxed_leather_laces_5.jpg",
      "/src/assets/images/waxed_leather_laces_6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 88,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 140,
    "colors": [],
    "shortDescription": "Phủ lớp sáp bóng chống bám bẩn và chống thấm nước tuyệt đối.",
    "description": "Được phủ một lớp sáp bảo vệ mỏng giúp dây giữ form cứng cáp, không bị xơ xù và dễ dàng lau sạch bùn đất chỉ với một chiếc khăn ẩm.",
    "status": "Đang bán",
    "createdAt": "22/01/2026"
  },
  {
    "id": "acc-magnetic-elastic-laces",
    "sku": "ACC-MAG-56",
    "name": "Dây Giày Thông Minh Co Giãn Khóa Nam Châm Không Cần Buộc",
    "brand": "K-NICKS",
    "category": "Dây giày",
    "gender": "Unisex",
    "price": 120000,
    "originalPrice": 150000,
    "image": "/src/assets/images/magnetic_elastic_laces.jpg",
    "images": [
      "/src/assets/images/magnetic_elastic_laces.jpg",
      "/src/assets/images/magnetic_elastic_laces_2.jpg",
      "/src/assets/images/magnetic_elastic_laces_3.jpg",
      "/src/assets/images/magnetic_elastic_laces_4.jpg",
      "/src/assets/images/magnetic_elastic_laces_5.jpg",
      "/src/assets/images/magnetic_elastic_laces_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 195,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 200,
    "colors": [],
    "shortDescription": "Xỏ giày vào là đi ngay chỉ trong 1 giây, lực hút nam châm siêu chặt.",
    "description": "Giải pháp hoàn hảo giúp bạn không bao giờ phải cúi xuống buộc lại dây giày bị tuột. Dây thun co giãn ôm chân vừa vặn, đầu khóa hợp kim nam châm chắc chắn.",
    "status": "Đang bán",
    "createdAt": "25/01/2026"
  },
  {
    "id": "acc-crew-socks-cushion",
    "sku": "ACC-SOCK-57",
    "name": "Set 3 Đôi Tất Cổ Cao Thể Thao K-NICKS Breathable Cushion",
    "brand": "K-NICKS",
    "category": "Tất / Vớ",
    "gender": "Unisex",
    "price": 165000,
    "originalPrice": 210000,
    "image": "/src/assets/images/crew_socks_cushion.jpg",
    "images": [
      "/src/assets/images/crew_socks_cushion.jpg",
      "/src/assets/images/crew_socks_cushion_2.jpg",
      "/src/assets/images/crew_socks_cushion_3.jpg",
      "/src/assets/images/crew_socks_cushion_4.jpg",
      "/src/assets/images/crew_socks_cushion_5.jpg",
      "/src/assets/images/crew_socks_cushion_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 310,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 300,
    "colors": [],
    "shortDescription": "Đệm dày ở lòng bàn chân chống phồng rộp, thoáng khí dệt kim 3D.",
    "description": "Chất liệu 80% Combed Cotton cao cấp thấm hút mồ hôi vượt trội, phần chun cổ tất dệt gân ôm sát không bị bai nhão hay tuột gót sau nhiều lần giặt.",
    "status": "Đang bán",
    "createdAt": "15/01/2026"
  },
  {
    "id": "acc-nike-everyday-socks",
    "sku": "ACC-NKSOCK-58",
    "name": "Tất Cổ Trung Nike Everyday Plus Cushioned (Set 3 Đôi)",
    "brand": "Nike",
    "category": "Tất / Vớ",
    "gender": "Unisex",
    "price": 190000,
    "image": "/src/assets/images/nike_cushioned_socks.jpg",
    "images": [
      "/src/assets/images/nike_cushioned_socks.jpg",
      "/src/assets/images/nike_cushioned_socks_2.jpg",
      "/src/assets/images/nike_cushioned_socks_3.jpg",
      "/src/assets/images/nike_cushioned_socks_4.jpg",
      "/src/assets/images/nike_cushioned_socks_5.jpg",
      "/src/assets/images/nike_cushioned_socks_6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 180,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 220,
    "colors": [],
    "shortDescription": "Công nghệ Dri-FIT giúp giữ cho đôi bàn chân luôn khô thoáng mát mẻ.",
    "description": "Dòng tất tập luyện quốc dân của Nike với đệm bọt bảo vệ ngón chân và gót chân, dải thun vòm bàn chân ôm khít hỗ trợ vận động thể thao mạnh mẽ.",
    "status": "Đang bán",
    "createdAt": "18/01/2026"
  },
  {
    "id": "acc-invisible-boat-socks",
    "sku": "ACC-INVIS-59",
    "name": "Set 5 Đôi Tất Lười Tàng Hình Chống Tụt Silicon Cao Cấp",
    "brand": "K-NICKS",
    "category": "Tất / Vớ",
    "gender": "Unisex",
    "price": 150000,
    "originalPrice": 190000,
    "image": "/src/assets/images/invisible_boat_socks.jpg",
    "images": [
      "/src/assets/images/invisible_boat_socks.jpg",
      "/src/assets/images/invisible_boat_socks_2.jpg",
      "/src/assets/images/invisible_boat_socks_3.jpg",
      "/src/assets/images/invisible_boat_socks_4.jpg",
      "/src/assets/images/invisible_boat_socks_5.jpg",
      "/src/assets/images/invisible_boat_socks_6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 145,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 280,
    "colors": [],
    "shortDescription": "Cắt khoét sâu tàng hình khi diện giày lười Loafer, Slip-on và Sneaker.",
    "description": "Trang bị dải đệm silicon sóng viền gót chân ngăn chặn tình trạng tuột gót khó chịu, vải sợi tre kháng khuẩn tự nhiên loại bỏ mùi hôi chân hiệu quả.",
    "status": "Đang bán",
    "createdAt": "22/01/2026"
  },
  {
    "id": "acc-compression-running-socks",
    "sku": "ACC-COMP-60",
    "name": "Tất Dệt Kim Thể Thao Bó Cơ Chạy Bộ Kháng Khuẩn Bạc Nano",
    "brand": "K-NICKS",
    "category": "Tất / Vớ",
    "gender": "Unisex",
    "price": 135000,
    "image": "/src/assets/images/compression_running_socks.jpg",
    "images": [
      "/src/assets/images/compression_running_socks.jpg",
      "/src/assets/images/compression_running_socks_2.jpg",
      "/src/assets/images/compression_running_socks_3.jpg",
      "/src/assets/images/compression_running_socks_4.jpg",
      "/src/assets/images/compression_running_socks_5.jpg",
      "/src/assets/images/compression_running_socks_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 92,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 150,
    "colors": [],
    "shortDescription": "Thiết kế nén ép cơ bắp hỗ trợ lưu thông máu và giảm mỏi cơ khi chạy xa.",
    "description": "Ứng dụng công nghệ sợi Ion Bạc kháng khuẩn vĩnh viễn, ngăn ngừa vi khuẩn gây mùi và nấm mốc trên những cung đường chạy dài khắc nghiệt.",
    "status": "Đang bán",
    "createdAt": "25/01/2026"
  },
  {
    "id": "acc-ortholite-insoles",
    "sku": "ACC-ORTHO-61",
    "name": "Lót Giày Thể Thao Đệm Khí OrthoLite Kháng Khuẩn Siêu Êm",
    "brand": "K-NICKS",
    "category": "Lót giày",
    "gender": "Unisex",
    "price": 180000,
    "originalPrice": 220000,
    "image": "/src/assets/images/ortholite_insoles.jpg",
    "images": [
      "/src/assets/images/ortholite_insoles.jpg",
      "/src/assets/images/ortholite_insoles_2.jpg",
      "/src/assets/images/ortholite_insoles_3.jpg",
      "/src/assets/images/ortholite_insoles_4.jpg",
      "/src/assets/images/ortholite_insoles_5.jpg",
      "/src/assets/images/ortholite_insoles_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 260,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "36": 15,
      "37": 20,
      "38": 25,
      "39": 30,
      "40": 35,
      "41": 30,
      "42": 25,
      "43": 15,
      "44": 10
    },
    "stockQuantity": 205,
    "colors": [],
    "shortDescription": "Bọt xốp tế bào mở thở được, êm ái đàn hồi và giữ chân khô ráo suốt ngày.",
    "description": "Công nghệ bọt xốp OrthoLite cao cấp có khả năng tự hồi phục độ dày trên 95% sau thời gian dài sử dụng, mang lại cảm giác êm ái tức thì cho mọi đôi giày.",
    "status": "Đang bán",
    "createdAt": "15/01/2026"
  },
  {
    "id": "acc-arch-support-eva",
    "sku": "ACC-ARCH-62",
    "name": "Lót Giày Chỉnh Hình Hỗ Trợ Vòm Chân EVA Memory Foam",
    "brand": "K-NICKS",
    "category": "Lót giày",
    "gender": "Unisex",
    "price": 220000,
    "image": "/src/assets/images/arch_support_insoles.jpg",
    "images": [
      "/src/assets/images/arch_support_insoles.jpg",
      "/src/assets/images/arch_support_insoles_2.jpg",
      "/src/assets/images/arch_support_insoles_3.jpg",
      "/src/assets/images/arch_support_insoles_4.jpg",
      "/src/assets/images/arch_support_insoles_5.jpg",
      "/src/assets/images/arch_support_insoles_6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 140,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      38,
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "38": 15,
      "39": 20,
      "40": 25,
      "41": 25,
      "42": 20,
      "43": 15
    },
    "stockQuantity": 120,
    "colors": [],
    "shortDescription": "Nâng đỡ vòm bàn chân bẹt, giảm đau mỏi gót chân và cột sống.",
    "description": "Khung vòm TPU dẻo uốn cong theo giải phẫu học bàn chân kết hợp đệm bọt hoạt tính Memory Foam phân tán lực đều khắp lòng bàn chân khi đứng lâu.",
    "status": "Đang bán",
    "createdAt": "19/01/2026"
  },
  {
    "id": "acc-height-increase-insole",
    "sku": "ACC-HGT-63",
    "name": "Lót Giày Tăng Chiều Cao Đệm Khí 3cm - 5cm 2 Tầng Tháo Rời",
    "brand": "K-NICKS",
    "category": "Lót giày",
    "gender": "Unisex",
    "price": 250000,
    "originalPrice": 300000,
    "image": "/src/assets/images/height_increase_insole.jpg",
    "images": [
      "/src/assets/images/height_increase_insole.jpg",
      "/src/assets/images/height_increase_insole_2.jpg",
      "/src/assets/images/height_increase_insole_3.jpg",
      "/src/assets/images/height_increase_insole_4.jpg",
      "/src/assets/images/height_increase_insole_5.jpg",
      "/src/assets/images/height_increase_insole_6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 175,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 160,
    "colors": [],
    "shortDescription": "Tăng ngay 3cm đến 5cm chiều cao bí mật và tự nhiên không lộ liễu.",
    "description": "Thiết kế túi đệm khí ở gót chân giúp giảm sốc cực tốt khi di chuyển, mô-đun tầng tháo lắp linh hoạt phù hợp cho nhiều loại giày cổ thấp lẫn cổ cao.",
    "status": "Đang bán",
    "createdAt": "23/01/2026"
  },
  {
    "id": "acc-silicone-heel-cups",
    "sku": "ACC-HEEL-64",
    "name": "Lót Đệm Gót Chân Silicon Chống Đau Thốn Giảm Chấn Viêm Cân Gan Chân",
    "brand": "K-NICKS",
    "category": "Lót giày",
    "gender": "Unisex",
    "price": 140000,
    "image": "/src/assets/images/silicone_heel_cups.jpg",
    "images": [
      "/src/assets/images/silicone_heel_cups.jpg",
      "/src/assets/images/silicone_heel_cups_2.jpg",
      "/src/assets/images/silicone_heel_cups_3.jpg",
      "/src/assets/images/silicone_heel_cups_4.jpg",
      "/src/assets/images/silicone_heel_cups_5.jpg",
      "/src/assets/images/silicone_heel_cups_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 115,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 190,
    "colors": [],
    "shortDescription": "Chất liệu gel y tế mềm mại nâng đỡ gót chân khỏi mọi tác động va đập.",
    "description": "Dành riêng cho những người hay bị đau thốn gót chân, gai gót hoặc viêm cân gan bàn chân. Có thể rửa sạch tái sử dụng nhiều lần không biến dạng.",
    "status": "Đang bán",
    "createdAt": "27/01/2026"
  },
  {
    "id": "acc-waterproof-shoe-bag",
    "sku": "ACC-BAG-65",
    "name": "Túi Đựng Giày Thể Thao Vải Oxford Chống Nước Cao Cấp",
    "brand": "K-NICKS",
    "category": "Túi đựng giày",
    "gender": "Unisex",
    "price": 220000,
    "image": "/src/assets/images/shoe_travel_bag.jpg",
    "images": [
      "/src/assets/images/shoe_travel_bag.jpg",
      "/src/assets/images/shoe_travel_bag_2.jpg",
      "/src/assets/images/shoe_travel_bag_3.jpg",
      "/src/assets/images/shoe_travel_bag_4.jpg",
      "/src/assets/images/shoe_travel_bag_5.jpg",
      "/src/assets/images/shoe_travel_bag_6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 140,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 180,
    "colors": [],
    "shortDescription": "Chất liệu vải Oxford dày dặn kháng nước, có quai xách và khóa kéo 2 chiều.",
    "description": "Túi đựng giày du lịch chuyên dụng với sức chứa vừa vặn cho mọi đôi giày thể thao size lớn tới 45. Ngăn lưới thông gió chống ẩm mốc và quai xách vali tiện lợi.",
    "status": "Đang bán",
    "createdAt": "16/01/2026"
  },
  {
    "id": "acc-transparent-travel-bag",
    "sku": "ACC-TRBAG-66",
    "name": "Túi Đựng Giày Du Lịch Trong Suốt 2 Ngăn Tiện Lợi Chống Bụi",
    "brand": "K-NICKS",
    "category": "Túi đựng giày",
    "gender": "Unisex",
    "price": 180000,
    "originalPrice": 220000,
    "image": "/src/assets/images/transparent_shoe_bag.jpg",
    "images": [
      "/src/assets/images/transparent_shoe_bag.jpg",
      "/src/assets/images/transparent_shoe_bag_2.jpg",
      "/src/assets/images/transparent_shoe_bag_3.jpg",
      "/src/assets/images/transparent_shoe_bag_4.jpg",
      "/src/assets/images/transparent_shoe_bag_5.jpg",
      "/src/assets/images/transparent_shoe_bag_6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 98,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 140,
    "colors": [],
    "shortDescription": "Mặt trước PVC trong suốt giúp bạn dễ dàng tìm kiếm đôi giày yêu thích.",
    "description": "Thiết kế hai ngăn tách biệt đựng được 1 đôi giày lớn và 1 đôi dép bệt hoặc tất vớ dự phòng, bảo vệ hành lý trong vali khỏi bụi bẩn của đế giày.",
    "status": "Đang bán",
    "createdAt": "20/01/2026"
  },
  {
    "id": "acc-drawstring-football-sack",
    "sku": "ACC-SACK-67",
    "name": "Balo Dây Rút Đựng Giày Đá Bóng K-NICKS Breathable Sackpack",
    "brand": "K-NICKS",
    "category": "Túi đựng giày",
    "gender": "Unisex",
    "price": 160000,
    "image": "/src/assets/images/drawstring_shoe_sack.jpg",
    "images": [
      "/src/assets/images/drawstring_shoe_sack.jpg",
      "/src/assets/images/drawstring_shoe_sack_2.jpg",
      "/src/assets/images/drawstring_shoe_sack_3.jpg",
      "/src/assets/images/drawstring_shoe_sack_4.jpg",
      "/src/assets/images/drawstring_shoe_sack_5.jpg",
      "/src/assets/images/drawstring_shoe_sack_6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 112,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 170,
    "colors": [],
    "shortDescription": "Balo dây rút tiện lợi khoác vai mang giày và phụ kiện ra sân bóng.",
    "description": "Chất liệu polyester trượt nước siêu nhẹ, có ngăn phụ có khóa kéo để điện thoại, ví tiền và chìa khóa xe an toàn.",
    "status": "Đang bán",
    "createdAt": "24/01/2026"
  },
  {
    "id": "acc-premium-cleaner-kit",
    "sku": "ACC-CLEAN-68",
    "name": "Bộ Vệ Sinh Giày Sneaker Toàn Diện (Dung Dịch Tạo Bọt + Bàn Chải + Khăn)",
    "brand": "K-NICKS Care",
    "category": "Dụng cụ vệ sinh giày",
    "gender": "Unisex",
    "price": 350000,
    "originalPrice": 420000,
    "image": "/src/assets/images/premium_cleaner_kit.jpg",
    "images": [
      "/src/assets/images/premium_cleaner_kit.jpg",
      "/src/assets/images/premium_cleaner_kit_2.jpg",
      "/src/assets/images/premium_cleaner_kit_3.jpg",
      "/src/assets/images/premium_cleaner_kit_4.jpg",
      "/src/assets/images/premium_cleaner_kit_5.jpg",
      "/src/assets/images/premium_cleaner_kit_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 380,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 240,
    "colors": [],
    "shortDescription": "Đánh bay mọi vết bẩn cứng đầu an toàn cho da thật, vải mesh và canvas.",
    "description": "Bộ sản phẩm chuyên nghiệp gồm chai bọt làm sạch 150ml chiết xuất từ dầu dừa và jojoba tự nhiên 98%, bàn chải lông mềm cao cấp và khăn lau sợi microfiber siêu thấm hút.",
    "status": "Đang bán",
    "createdAt": "15/01/2026"
  },
  {
    "id": "acc-nano-waterproof-spray",
    "sku": "ACC-NANO-69",
    "name": "Bình Xịt Nano Chống Thấm Nước & Bụi Bẩn Bền Vững K-NICKS Shield (250ml)",
    "brand": "K-NICKS Care",
    "category": "Dụng cụ vệ sinh giày",
    "gender": "Unisex",
    "price": 280000,
    "originalPrice": 320000,
    "image": "/src/assets/images/nano_waterproof_spray.jpg",
    "images": [
      "/src/assets/images/nano_waterproof_spray.jpg",
      "/src/assets/images/nano_waterproof_spray_2.jpg",
      "/src/assets/images/nano_waterproof_spray_3.jpg",
      "/src/assets/images/nano_waterproof_spray_4.jpg",
      "/src/assets/images/nano_waterproof_spray_5.jpg",
      "/src/assets/images/nano_waterproof_spray_6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 220,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 210,
    "colors": [],
    "shortDescription": "Lớp khiên nano vô hình bảo vệ giày khỏi cà phê, tương ớt và bùn đất trời mưa.",
    "description": "Ứng dụng hiệu ứng lá sen kỵ nước đỉnh cao. Chỉ cần xịt 2 lớp, giày của bạn sẽ hoàn toàn miễn nhiễm với nước bẩn và chất lỏng có màu trong suốt 30 ngày.",
    "status": "Đang bán",
    "createdAt": "18/01/2026"
  },
  {
    "id": "acc-deodorant-fresh-spray",
    "sku": "ACC-DEOD-70",
    "name": "Bình Xịt Khử Mùi Diệt Khuẩn Giày Hương Bạc Hà Tươi Mát (150ml)",
    "brand": "K-NICKS Care",
    "category": "Dụng cụ vệ sinh giày",
    "gender": "Unisex",
    "price": 160000,
    "image": "/src/assets/images/sneaker_deodorant_spray.jpg",
    "images": [
      "/src/assets/images/sneaker_deodorant_spray.jpg",
      "/src/assets/images/sneaker_deodorant_spray_2.jpg",
      "/src/assets/images/sneaker_deodorant_spray_3.jpg",
      "/src/assets/images/sneaker_deodorant_spray_4.jpg",
      "/src/assets/images/sneaker_deodorant_spray_5.jpg",
      "/src/assets/images/sneaker_deodorant_spray_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 165,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 260,
    "colors": [],
    "shortDescription": "Diệt 99.9% vi khuẩn gây mùi hôi khó chịu ngay sau 3 giây xịt.",
    "description": "Công thức chứa cồn sinh học và tinh dầu bạc hà sảng khoái, khô ráo tức thì không gây ẩm ướt lót giày, giữ cho không gian giày luôn thơm tho cả ngày.",
    "status": "Đang bán",
    "createdAt": "21/01/2026"
  },
  {
    "id": "acc-cedar-shoe-trees",
    "sku": "ACC-TREE-71",
    "name": "Cây Giữ Form Giày Gỗ Tuyết Tùng Tự Nhiên Hút Ẩm (Cedar Shoe Trees)",
    "brand": "K-NICKS Care",
    "category": "Phụ kiện khác",
    "gender": "Nam",
    "price": 490000,
    "originalPrice": 580000,
    "image": "/src/assets/images/cedar_shoe_trees.jpg",
    "images": [
      "/src/assets/images/cedar_shoe_trees.jpg",
      "/src/assets/images/cedar_shoe_trees_2.jpg",
      "/src/assets/images/cedar_shoe_trees_3.jpg",
      "/src/assets/images/cedar_shoe_trees_4.jpg",
      "/src/assets/images/cedar_shoe_trees_5.jpg",
      "/src/assets/images/cedar_shoe_trees_6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 130,
    "isNew": false,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 10,
      "40": 15,
      "41": 20,
      "42": 20,
      "43": 15,
      "44": 10
    },
    "stockQuantity": 90,
    "colors": [],
    "shortDescription": "Giữ form giày luôn căng phẳng, xóa nếp nhăn và hút ẩm thơm tự nhiên.",
    "description": "Chế tác từ 100% gỗ tuyết tùng Bắc Mỹ chưa qua xử lý hóa chất. Lò xo kép căng chỉnh lực đều, hương thơm thảo mộc tự nhiên xua đuổi côn trùng và hút sạch mồ hôi đọng trong giày da.",
    "status": "Đang bán",
    "createdAt": "24/01/2026"
  },
  {
    "id": "acc-sneaker-eraser",
    "sku": "ACC-ERASER-72",
    "name": "Gôm Tẩy Khô Chuyên Dụng Cho Giày Da Lộn Suede & Viền Đế Cao Su",
    "brand": "K-NICKS Care",
    "category": "Phụ kiện khác",
    "gender": "Unisex",
    "price": 90000,
    "image": "/src/assets/images/sneaker_eraser.jpg",
    "images": [
      "/src/assets/images/sneaker_eraser.jpg",
      "/src/assets/images/sneaker_eraser_2.jpg",
      "/src/assets/images/sneaker_eraser_3.jpg",
      "/src/assets/images/sneaker_eraser_4.jpg",
      "/src/assets/images/sneaker_eraser_5.jpg",
      "/src/assets/images/sneaker_eraser_6.jpg"
    ],
    "rating": 4.7,
    "reviewsCount": 95,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": false,
    "sizes": [],
    "sizeStock": {},
    "stockQuantity": 190,
    "colors": [],
    "shortDescription": "Tẩy sạch vết bẩn khô tức thì không cần dùng nước hay xà phòng.",
    "description": "Tiện lợi mang theo bên mình mọi lúc mọi nơi. Chỉ cần chà nhẹ lên các vết ố bẩn trên da lộn nubuck hoặc viền đế cao su trắng là sạch bóng như mới.",
    "status": "Đang bán",
    "createdAt": "28/01/2026"
  },
  {
    "id": "chelsea-boots-suede",
    "sku": "BT-CHEL-51",
    "name": "Giày Chelsea Boots Da Lộn Cao Cấp K-NICKS",
    "brand": "K-NICKS Classic",
    "category": "Giày tây",
    "gender": "Nam",
    "price": 2850000,
    "originalPrice": 3200000,
    "image": "/src/assets/images/shoes/chelsea-boots-suede.jpg",
    "images": [
      "/src/assets/images/shoes/chelsea-boots-suede.jpg",
      "/src/assets/images/shoes/chelsea-boots-suede-2.jpg",
      "/src/assets/images/shoes/chelsea-boots-suede-3.jpg",
      "/src/assets/images/shoes/chelsea-boots-suede-4.jpg",
      "/src/assets/images/shoes/chelsea-boots-suede-5.jpg",
      "/src/assets/images/shoes/chelsea-boots-suede-6.jpg"
    ],
    "rating": 5,
    "reviewsCount": 28,
    "isNew": true,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 6,
      "40": 12,
      "41": 16,
      "42": 12,
      "43": 6
    },
    "stockQuantity": 52,
    "colors": [
      {
        "name": "Xám Khói Da Lộn",
        "hex": "#475569",
        "image": "/src/assets/images/shoes/chelsea-boots-suede-grey.jpg",
        "images": [
          "/src/assets/images/shoes/chelsea-boots-suede-grey.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-grey-2.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-grey-3.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-grey-4.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-grey-5.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-grey-6.jpg"
        ]
      },
      {
        "name": "Vàng Cát Sand",
        "hex": "#D97706",
        "image": "/src/assets/images/shoes/chelsea-boots-suede-sand.jpg",
        "images": [
          "/src/assets/images/shoes/chelsea-boots-suede-sand.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-sand-2.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-sand-3.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-sand-4.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-sand-5.jpg",
          "/src/assets/images/shoes/chelsea-boots-suede-sand-6.jpg"
        ]
      }
    ],
    "shortDescription": "Boots cổ thun co giãn phong cách rock & roll thời thượng.",
    "description": "Chất liệu da lộn mềm mịn như nhung, cổ chun đàn hồi ôm sát cổ chân và đế phíp cao cấp giúp kéo dài đôi chân và tạo điểm nhấn hút mắt khi diện quần slim-fit.",
    "status": "Đang bán",
    "createdAt": "17/09/2026"
  },
  {
    "id": "oxford-captoe-black",
    "sku": "OX-CAP-48",
    "name": "Giày Tây Oxford Captoe Da Bò Ý Cao Cấp",
    "brand": "K-NICKS Classic",
    "category": "Giày tây",
    "gender": "Nam",
    "price": 3200000,
    "originalPrice": 3600000,
    "image": "/src/assets/images/shoes/oxford-captoe-black.jpg",
    "images": [
      "/src/assets/images/shoes/oxford-captoe-black.jpg",
      "/src/assets/images/shoes/oxford-captoe-black-2.jpg",
      "/src/assets/images/shoes/oxford-captoe-black-3.jpg",
      "/src/assets/images/shoes/oxford-captoe-black-4.jpg",
      "/src/assets/images/shoes/oxford-captoe-black-5.jpg",
      "/src/assets/images/shoes/oxford-captoe-black-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 42,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 5,
      "40": 10,
      "41": 15,
      "42": 12,
      "43": 8,
      "44": 4
    },
    "stockQuantity": 54,
    "colors": [
      {
        "name": "Đen Bóng Quý Tộc",
        "hex": "#0F172A",
        "image": "/src/assets/images/shoes/oxford-captoe-black.jpg",
        "images": [
          "/src/assets/images/shoes/oxford-captoe-black.jpg",
          "/src/assets/images/shoes/oxford-captoe-black-2.jpg",
          "/src/assets/images/shoes/oxford-captoe-black-3.jpg",
          "/src/assets/images/shoes/oxford-captoe-black-4.jpg",
          "/src/assets/images/shoes/oxford-captoe-black-5.jpg",
          "/src/assets/images/shoes/oxford-captoe-black-6.jpg"
        ]
      }
    ],
    "shortDescription": "Da bò thuộc thảo mộc mềm mại, phom dáng chuẩn mực cho quý ông lịch lãm.",
    "description": "Biểu tượng của sự chỉn chu và trang trọng bậc nhất. Đường may Captoe thanh thoát ở mũi giày kết hợp kỹ thuật đóng đế Goodyear Welted đỉnh cao mang đến độ bền và đẳng cấp vượt thời gian.",
    "status": "Đang bán",
    "createdAt": "18/09/2026"
  },
  {
    "id": "derby-plain-toe-brown",
    "sku": "DB-PLAIN-49",
    "name": "Giày Derby Nam Da Bò Mộc Savato Sang Trọng",
    "brand": "Savato",
    "category": "Giày tây",
    "gender": "Nam",
    "price": 2450000,
    "originalPrice": 2750000,
    "image": "/src/assets/images/shoes/derby-plain-toe-brown.jpg",
    "images": [
      "/src/assets/images/shoes/derby-plain-toe-brown.jpg",
      "/src/assets/images/shoes/derby-plain-toe-brown-2.jpg",
      "/src/assets/images/shoes/derby-plain-toe-brown-3.jpg",
      "/src/assets/images/shoes/derby-plain-toe-brown-4.jpg",
      "/src/assets/images/shoes/derby-plain-toe-brown-5.jpg",
      "/src/assets/images/shoes/derby-plain-toe-brown-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 35,
    "isNew": false,
    "isBestSeller": true,
    "isPromotion": false,
    "isHot": false,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 4,
      "40": 10,
      "41": 14,
      "42": 10,
      "43": 6
    },
    "stockQuantity": 44,
    "colors": [
      {
        "name": "Nâu Cà Phê Hạt",
        "hex": "#78350F",
        "image": "/src/assets/images/shoes/derby-plain-toe-brown.jpg",
        "images": [
          "/src/assets/images/shoes/derby-plain-toe-brown.jpg",
          "/src/assets/images/shoes/derby-plain-toe-brown-2.jpg",
          "/src/assets/images/shoes/derby-plain-toe-brown-3.jpg",
          "/src/assets/images/shoes/derby-plain-toe-brown-4.jpg",
          "/src/assets/images/shoes/derby-plain-toe-brown-5.jpg",
          "/src/assets/images/shoes/derby-plain-toe-brown-6.jpg"
        ]
      }
    ],
    "shortDescription": "Phom mở dễ đi, da bò mộc tự nhiên lên nước bóng đẹp theo thời gian.",
    "description": "Thiết kế mui hở (Open Lacing) đặc trưng của Derby mang lại sự thoải mái tối đa cho người có mu bàn chân dày. Tông màu nâu hạt dẻ ấm áp dễ phối với cả âu phục lẫn quần chinos dạo phố.",
    "status": "Đang bán",
    "createdAt": "18/09/2026"
  },
  {
    "id": "penny-loafer-burgundy",
    "sku": "LF-PENNY-50",
    "name": "Giày Penny Loafer Da Bóng Khóa Ngang Tinh Tế",
    "brand": "K-NICKS Classic",
    "category": "Giày tây",
    "gender": "Nam",
    "price": 2650000,
    "originalPrice": 2950000,
    "image": "/src/assets/images/shoes/penny-loafer-burgundy.jpg",
    "images": [
      "/src/assets/images/shoes/penny-loafer-burgundy.jpg",
      "/src/assets/images/shoes/penny-loafer-burgundy-2.jpg",
      "/src/assets/images/shoes/penny-loafer-burgundy-3.jpg",
      "/src/assets/images/shoes/penny-loafer-burgundy-4.jpg",
      "/src/assets/images/shoes/penny-loafer-burgundy-5.jpg",
      "/src/assets/images/shoes/penny-loafer-burgundy-6.jpg"
    ],
    "rating": 4.8,
    "reviewsCount": 29,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43
    ],
    "sizeStock": {
      "39": 5,
      "40": 12,
      "41": 15,
      "42": 10,
      "43": 5
    },
    "stockQuantity": 47,
    "colors": [
      {
        "name": "Đỏ Rượu Burgundy",
        "hex": "#881337",
        "image": "/src/assets/images/shoes/penny-loafer-burgundy.jpg",
        "images": [
          "/src/assets/images/shoes/penny-loafer-burgundy.jpg",
          "/src/assets/images/shoes/penny-loafer-burgundy-2.jpg",
          "/src/assets/images/shoes/penny-loafer-burgundy-3.jpg",
          "/src/assets/images/shoes/penny-loafer-burgundy-4.jpg",
          "/src/assets/images/shoes/penny-loafer-burgundy-5.jpg",
          "/src/assets/images/shoes/penny-loafer-burgundy-6.jpg"
        ]
      }
    ],
    "shortDescription": "Thiết kế xỏ chân tiện lợi, sắc đỏ rượu burgundy sang trọng quý phái.",
    "description": "Lấy cảm hứng từ nét văn hóa preppy cổ điển của các trường đại học Ivy League thập niên 50. Chi tiết đai da ngang thân giày cùng gam màu đỏ rượu độc đáo giúp tôn vinh gu thẩm mỹ tinh tế của chủ nhân.",
    "status": "Đang bán",
    "createdAt": "19/09/2026"
  },
  {
    "id": "double-monk-strap-tan",
    "sku": "MK-STRAP-52",
    "name": "Giày Double Monk Strap Khóa Đôi Sang Trọng",
    "brand": "K-NICKS Classic",
    "category": "Giày tây",
    "gender": "Nam",
    "price": 2950000,
    "originalPrice": 3350000,
    "image": "/src/assets/images/shoes/double-monk-strap-tan.jpg",
    "images": [
      "/src/assets/images/shoes/double-monk-strap-tan.jpg",
      "/src/assets/images/shoes/double-monk-strap-tan-2.jpg",
      "/src/assets/images/shoes/double-monk-strap-tan-3.jpg",
      "/src/assets/images/shoes/double-monk-strap-tan-4.jpg",
      "/src/assets/images/shoes/double-monk-strap-tan-5.jpg",
      "/src/assets/images/shoes/double-monk-strap-tan-6.jpg"
    ],
    "rating": 4.9,
    "reviewsCount": 31,
    "isNew": true,
    "isBestSeller": false,
    "isPromotion": true,
    "isHot": true,
    "hasSizes": true,
    "sizes": [
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "sizeStock": {
      "39": 4,
      "40": 8,
      "41": 14,
      "42": 12,
      "43": 6,
      "44": 4
    },
    "stockQuantity": 48,
    "colors": [
      {
        "name": "Nâu Tan Cháy",
        "hex": "#B45309",
        "image": "/src/assets/images/shoes/double-monk-strap-tan.jpg",
        "images": [
          "/src/assets/images/shoes/double-monk-strap-tan.jpg",
          "/src/assets/images/shoes/double-monk-strap-tan-2.jpg",
          "/src/assets/images/shoes/double-monk-strap-tan-3.jpg",
          "/src/assets/images/shoes/double-monk-strap-tan-4.jpg",
          "/src/assets/images/shoes/double-monk-strap-tan-5.jpg",
          "/src/assets/images/shoes/double-monk-strap-tan-6.jpg"
        ]
      }
    ],
    "shortDescription": "Khóa cài kim loại mạ vàng đồng đôi, cá tính và thu hút ánh nhìn.",
    "description": "Là sự giao thoa hoàn hảo giữa trang trọng và phóng khoáng. Hai khóa kim loại ánh đồng tạo điểm nhấn bắt mắt, kết hợp với chất liệu da bò mộc đánh màu thủ công patina tạo nên hiệu ứng chuyển màu sống động.",
    "status": "Đang bán",
    "createdAt": "19/09/2026"
  }
];
export const INITIAL_BRANDS: BrandItem[] = [
  {
    id: 'brand-nike',
    name: 'Nike',
    slug: 'nike',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23111111"><path d="M21.71 7.04c-2.83 2.58-6.63 5.42-10.42 7.71-2.48 1.5-4.94 2.66-7.07 3.19-.53.13-1.02.2-1.45.2-.67 0-1.19-.18-1.5-.54-.4-.46-.47-1.19-.2-2.12.39-1.34 1.34-3.05 2.76-4.97C5.7 8.01 8.27 5.57 11.33 3.39c.66-.47 1.47-.35 1.95.27.46.61.35 1.47-.27 1.95-2.83 2.01-5.2 4.25-6.9 6.38-1.17 1.46-1.87 2.73-2.11 3.63-.09.34-.07.54-.03.62.05.11.17.21.43.21.31 0 .71-.06 1.15-.17 1.83-.46 4.02-1.48 6.27-2.84 3.52-2.12 7.08-4.78 9.77-7.22.61-.55 1.55-.5 2.11.11.55.61.51 1.55-.1 2.11z"/></svg>',
    country: 'Mỹ',
    color: '#FF5400',
    tagline: 'Just Do It',
    description: 'Thương hiệu thể thao hàng đầu thế giới với các công nghệ đột phá Air Max, ZoomX, và Flyknit.',
    subcategories: ['Nike Air Max', 'Nike Pegasus', 'Nike ZoomX', 'Giày Bóng Đá Phantom'],
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'brand-adidas',
    name: 'Adidas',
    slug: 'adidas',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23111111"><path d="M2 19h3.5L10 10.5 7.8 7zM7.5 19h3.5l5.2-9.7-2.3-2.8zM13 19h3.5L23 7.8l-2.4-1.8z"/></svg>',
    country: 'Đức',
    color: '#007BC4',
    tagline: 'Impossible Is Nothing',
    description: 'Sự kết hợp hoàn hảo giữa hiệu năng thể thao và phong cách thời trang đường phố cao cấp.',
    subcategories: ['Adidas Ultraboost', 'Adidas Samba', 'Adidas Stan Smith', 'Giày Bóng Đá Predator'],
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'brand-puma',
    name: 'Puma',
    slug: 'puma',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23111111"><path d="M19.5 5.5c-1.2 0-2.2.8-2.6 1.9l-2.2 1.3c-.6-.4-1.4-.7-2.2-.7-1.8 0-3.3 1.2-3.8 2.8L5.5 12c-1.4.3-2.5 1.5-2.5 3 0 1.7 1.3 3 3 3 1.1 0 2-.6 2.5-1.5l3.2-1.2c.7.4 1.5.7 2.3.7 2.2 0 4-1.8 4-4 0-.3 0-.6-.1-.9l2.4-1.4c.5.5 1.2.8 1.9.8 1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.7-2.5z"/></svg>',
    country: 'Đức',
    color: '#BA0C2F',
    tagline: 'Forever Faster',
    description: 'Thương hiệu của tốc độ và cá tính nổi loạn, luôn dẫn đầu xu hướng thời trang trẻ trung.',
    subcategories: ['Puma RS-X', 'Puma Velocity Nitro', 'Puma Future Football', 'Puma Suede'],
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'brand-converse',
    name: 'Converse',
    slug: 'converse',
    logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23111111"><circle cx="12" cy="12" r="10" stroke="%23111111" stroke-width="1.5" fill="none"/><path d="M12 7.5l1.4 2.8 3.1.4-2.2 2.2.5 3.1-2.8-1.5-2.8 1.5.5-3.1-2.2-2.2 3.1-.4z"/></svg>',
    country: 'Mỹ',
    color: '#000000',
    tagline: 'Create Next',
    description: 'Biểu tượng văn hóa đại chúng trường tồn cùng các thế hệ, định hình phong cách sống bụi bặm.',
    subcategories: ['Chuck Taylor All Star', 'Chuck 70 Vintage', 'Run Star Hike', 'Converse One Star'],
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  }
];

export const BRANDS = INITIAL_BRANDS;

export const INITIAL_CATEGORIES: CategoryItem[] = [
  // Nhóm: Giày theo loại
  {
    id: 'cat-sneaker',
    name: 'Sneaker',
    slug: 'sneaker',
    group: 'shoes',
    description: 'Danh mục các dòng giày Sneaker thời trang phong cách đường phố năng động.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-the-thao',
    name: 'Giày thể thao',
    slug: 'sports-shoes',
    group: 'shoes',
    description: 'Giày thể thao đa năng dành cho luyện tập, tập gym và hoạt động thể chất.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-running',
    name: 'Giày chạy bộ',
    slug: 'running',
    group: 'shoes',
    description: 'Giày chạy bộ chuyên nghiệp trang bị công nghệ đệm khí, siêu nhẹ và êm ái.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-football',
    name: 'Giày bóng đá',
    slug: 'football',
    group: 'shoes',
    description: 'Giày đá bóng chuyên dụng dành cho sân cỏ nhân tạo và sân cỏ tự nhiên.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-lifestyle',
    name: 'Giày lifestyle',
    slug: 'lifestyle',
    group: 'shoes',
    description: 'Giày thời trang di chuyển hàng ngày, phối đồ linh hoạt và sang trọng.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-training',
    name: 'Training',
    slug: 'training',
    group: 'shoes',
    description: 'Giày tập gym, fitness và luyện tập thể thao chuyên sâu.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },

  // Nhóm: Phụ kiện
  {
    id: 'cat-day-giay',
    name: 'Dây giày',
    slug: 'shoelaces',
    group: 'accessories',
    description: 'Dây giày tròn, dẹt, phản quang và sáp cao cấp nhiều kích cỡ.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-socks',
    name: 'Tất / Vớ',
    slug: 'socks',
    group: 'accessories',
    description: 'Tất thể thao cổ cao, cổ trung, tất lười dệt kim thoáng khí.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-lot-giay',
    name: 'Lót giày',
    slug: 'insoles',
    group: 'accessories',
    description: 'Lót đệm OrthoLite, lót bọt khí êm ái tăng cường hỗ trợ vòm bàn chân.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-tui-giay',
    name: 'Túi đựng giày',
    slug: 'shoe-bags',
    group: 'accessories',
    description: 'Túi đựng giày du lịch, chống thấm nước và bảo quản giày tối ưu.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-ve-sinh',
    name: 'Dụng cụ vệ sinh giày',
    slug: 'shoe-care',
    group: 'accessories',
    description: 'Bộ dung dịch làm sạch, bình xịt nano chống thấm nước và bàn chải chuyên dụng.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  },
  {
    id: 'cat-phu-kien-khac',
    name: 'Phụ kiện khác',
    slug: 'other-accessories',
    group: 'accessories',
    description: 'Cây giữ form giày Shoe Trees, túi hút ẩm khử mùi cao cấp.',
    status: 'Đang hoạt động',
    createdAt: '15/07/2026'
  }
];

export const CATEGORIES = [
  { name: 'Sneaker' as const, count: 245, icon: 'Sneakers', label: 'Thời trang' },
  { name: 'Running' as const, count: 180, icon: 'Flame', label: 'Chạy bộ' },
  { name: 'Football' as const, count: 120, icon: 'Trophy', label: 'Bóng đá' },
  { name: 'Lifestyle' as const, count: 310, icon: 'Compass', label: 'Hằng ngày' },
  { name: 'Training' as const, count: 140, icon: 'Zap', label: 'Luyện tập' }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'nike-air-max-pulse',
    productName: 'Nike Air Max Pulse',
    productSku: 'NK-AMP-2026',
    productImage: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
    name: 'Nguyễn Minh Tuấn',
    email: 'minhtuan.nguyen@gmail.com',
    rating: 5,
    comment: 'Tôi cực kỳ ấn tượng với đôi Nike Air Max Pulse mua tại shop. Giày chuẩn auth, đi cực kỳ êm chân, phối màu neon quá nổi bật để diện phố. Giao hàng nhanh chỉ trong 2 ngày!',
    date: '15/07/2026',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    isVerifiedBuyer: true,
    purchasedSize: 42,
    purchasedColor: 'Neon Orange',
    helpfulCount: 14,
    helpfulUserIds: ['u-101', 'u-102'],
    status: 'Đã hiển thị',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rev-2',
    productId: 'adidas-ultraboost-light',
    productName: 'Adidas Ultraboost Light',
    productSku: 'AD-UBL-2026',
    productImage: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
    name: 'Trần Thị Mai Anh',
    email: 'minhtran@gmail.com',
    rating: 5,
    comment: 'Đôi Adidas Ultraboost Light chạy sướng thật sự, êm chân và phản hồi lực rất tốt. Đội ngũ nhân viên tư vấn size siêu nhiệt tình và chuẩn xác. Chắc chắn sẽ quay lại mua thêm!',
    date: '12/07/2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    isVerifiedBuyer: true,
    purchasedSize: 41,
    purchasedColor: 'Core Black',
    helpfulCount: 22,
    helpfulUserIds: ['u-103'],
    status: 'Đã hiển thị'
  },
  {
    id: 'rev-3',
    productId: 'converse-chuck-70',
    productName: "Converse Chuck Taylor '70",
    productSku: 'CV-CT70-2026',
    productImage: '/src/assets/images/converse_classic_shoe_1784366541899.jpg',
    name: 'Phạm Hoàng Nam',
    email: 'hoangnam.pham@gmail.com',
    rating: 5,
    comment: 'Converse Chuck 70 Navy đi siêu phối đồ luôn. Thiết kế cổ điển bền bỉ, đúng chất premium. Trải nghiệm mua sắm mượt mà từ đặt hàng đến nhận hàng, website giao diện hiện đại lắm.',
    date: '08/07/2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    isVerifiedBuyer: true,
    purchasedSize: 40,
    purchasedColor: 'Classic Navy',
    helpfulCount: 8,
    helpfulUserIds: [],
    status: 'Đã hiển thị'
  },
  {
    id: 'rev-4',
    productId: 'puma-rsx-retro',
    productName: 'Puma RS-X Retro Drift',
    productSku: 'PM-RSX-2026',
    productImage: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg',
    name: 'Lê Thanh Hải',
    email: 'thanhhai.le@gmail.com',
    rating: 4,
    comment: 'Đã nhận được đôi Puma RS-X Retro Drift. Thiết kế hầm hố cực phong cách, mang đi làm hay đi chơi đều rất đẹp. Trừ 1 điểm vì hộp giày hơi móp một chút do bên vận chuyển.',
    date: '02/08/2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    isVerifiedBuyer: true,
    purchasedSize: 43,
    purchasedColor: 'Retro Multi',
    helpfulCount: 5,
    helpfulUserIds: [],
    status: 'Chờ duyệt',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rev-5',
    productId: 'nike-vaporfly-3',
    productName: 'Nike ZoomX Vaporfly 3',
    productSku: 'NK-VP3-2026',
    productImage: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
    name: 'Đặng Quốc Khánh',
    email: 'quockhanh.dang@gmail.com',
    rating: 3,
    comment: 'Size giày đi hơi ôm ngang chân, màu sắc thực tế không sáng bằng hình ảnh render trên web. Hy vọng đi vài lần sẽ dãn vừa chân hơn.',
    date: '05/08/2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    isVerifiedBuyer: false,
    status: 'Chờ duyệt'
  },
  {
    id: 'rev-6',
    productId: 'adidas-samba-classic',
    productName: 'Adidas Samba Classic',
    productSku: 'AD-SMB-2026',
    productImage: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
    name: 'Vũ Ngọc Ánh',
    email: 'ngocanh.vu@gmail.com',
    rating: 1,
    comment: 'Nội dung chứa liên kết quảng cáo không phù hợp với đánh giá sản phẩm.',
    date: '01/08/2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    isVerifiedBuyer: false,
    status: 'Đã ẩn',
    isHidden: true
  }
];

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    title: 'NIKE AIR MAX PULSE',
    subtitle: 'THẾ HỆ ĐỆM KHÍ ĐỘT PHÁ',
    description: 'Sự giao thoa hoàn hảo giữa thời trang đường phố bụi bặm và hiệu suất đỉnh cao. Thiết kế lấy cảm hứng từ năng lượng bất tận của London.',
    price: '4.200.000đ',
    badge: 'NEW ARRIVAL',
    brand: 'Nike',
    image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
    colorTheme: 'from-orange-600/20 to-neutral-900',
    accentColor: '#FF5400',
    buttonText: 'Mua Ngay',
    buttonLink: 'nike-air-max-pulse'
  },
  {
    id: 'slide-2',
    title: 'ADIDAS ULTRABOOST LIGHT',
    subtitle: 'NĂNG LƯỢNG KHÔNG GIỚI HẠN',
    description: 'Phiên bản Ultraboost nhẹ nhất lịch sử chạy bộ. Hoàn trả năng lượng vượt trội kết hợp thân giày Primeknit dệt từ rác thải đại dương tái chế.',
    price: '5.200.000đ',
    badge: 'BEST SELLER',
    brand: 'Adidas',
    image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
    colorTheme: 'from-blue-600/20 to-neutral-900',
    accentColor: '#007BC4',
    buttonText: 'Trải Nghiệm Ngay',
    buttonLink: 'adidas-ultraboost-light'
  },
  {
    id: 'slide-3',
    title: 'PUMA RS-X RETRO DRIFT',
    subtitle: 'TÁO BẠO & KHÁC BIỆT',
    description: 'Thiết kế chunky hầm hố kết hợp những khối màu mang đậm âm hưởng thập niên 80. Sự nổi loạn không khoan nhượng của phong cách vị lai.',
    price: '3.400.000đ',
    badge: 'LIMITED EDITION',
    brand: 'Puma',
    image: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg',
    colorTheme: 'from-pink-600/20 to-neutral-900',
    accentColor: '#D946EF',
    buttonText: 'Khám Phá',
    buttonLink: 'puma-rsx-retro'
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-sole20',
    code: 'SOLE20',
    name: 'SALE THÁNG 8',
    description: 'Ưu đãi chào đón tháng 8 - Giảm 20% tối đa 200.000đ cho đơn hàng từ 500.000đ',
    discountType: 'percent',
    discountValue: 20,
    minOrderValue: 500000,
    maxDiscountAmount: 200000,
    maxUsageLimit: 500,
    usedCount: 125,
    perUserLimit: 1,
    startDate: '2026-08-01T00:00',
    endDate: '2026-08-31T23:59',
    status: 'Đang hoạt động',
    scope: 'all',
    createdAt: '01/08/2026'
  },
  {
    id: 'promo-sole10',
    code: 'SOLE10',
    name: 'TRI ÂN KHÁCH HÀNG',
    description: 'Giảm ngay 10% tối đa 300.000đ cho tất cả khách hàng thân thiết với hóa đơn từ 1.000.000đ',
    discountType: 'percent',
    discountValue: 10,
    minOrderValue: 1000000,
    maxDiscountAmount: 300000,
    maxUsageLimit: 0,
    usedCount: 42,
    perUserLimit: 0,
    startDate: '2026-07-01T00:00',
    endDate: '2026-09-30T23:59',
    status: 'Đang hoạt động',
    scope: 'all',
    createdAt: '01/07/2026'
  },
  {
    id: 'promo-sole300',
    code: 'SOLE300',
    name: 'VOUCHER KHỦNG 300K',
    description: 'Giảm thẳng 300.000đ cho các dòng giày Sneaker và Running cao cấp từ 2.500.000đ',
    discountType: 'fixed',
    discountValue: 300000,
    minOrderValue: 2500000,
    maxUsageLimit: 100,
    usedCount: 18,
    perUserLimit: 1,
    startDate: '2026-07-15T00:00',
    endDate: '2026-08-25T23:59',
    status: 'Đang hoạt động',
    scope: 'category',
    targetCategories: ['Sneaker', 'Running'],
    createdAt: '15/07/2026'
  },
  {
    id: 'promo-nikevip50',
    code: 'NIKEVIP50',
    name: 'ƯU ĐÃI ĐẶC BIỆT NIKE',
    description: 'Giảm 150.000đ khi mua bất kỳ dòng giày thể thao Nike chính hãng nào',
    discountType: 'fixed',
    discountValue: 150000,
    minOrderValue: 2000000,
    maxUsageLimit: 200,
    usedCount: 28,
    perUserLimit: 2,
    startDate: '2026-08-01T00:00',
    endDate: '2026-08-31T23:59',
    status: 'Đang hoạt động',
    scope: 'brand',
    targetBrands: ['Nike'],
    createdAt: '01/08/2026'
  },
  {
    id: 'promo-autumn2026',
    code: 'AUTUMN2026',
    name: 'ĐÓN MÙA THU 2026',
    description: 'Chương trình ưu đãi mùa thu sắp diễn ra. Giảm 15% tối đa 250.000đ',
    discountType: 'percent',
    discountValue: 15,
    minOrderValue: 800000,
    maxDiscountAmount: 250000,
    maxUsageLimit: 300,
    usedCount: 0,
    perUserLimit: 1,
    startDate: '2026-09-01T00:00',
    endDate: '2026-09-30T23:59',
    status: 'Đang hoạt động',
    scope: 'all',
    createdAt: '10/08/2026'
  },
  {
    id: 'promo-summersale',
    code: 'SUMMERSALE',
    name: 'SIÊU SALE HÈ RỰC RỠ',
    description: 'Chương trình bùng nổ mùa hè đã kết thúc đợt phát hành voucher.',
    discountType: 'percent',
    discountValue: 25,
    minOrderValue: 1500000,
    maxDiscountAmount: 400000,
    maxUsageLimit: 500,
    usedCount: 500,
    perUserLimit: 1,
    startDate: '2026-06-01T00:00',
    endDate: '2026-06-30T23:59',
    status: 'Hết hạn',
    scope: 'all',
    createdAt: '01/06/2026'
  }
];

export const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'banner-hero-1',
    name: 'Nike Air Max Pulse - New Arrival',
    image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
    title: 'NIKE AIR MAX PULSE',
    subtitle: 'THẾ HỆ ĐỆM KHÍ ĐỘT PHÁ',
    description: 'Sự giao thoa hoàn hảo giữa thời trang đường phố bụi bặm và hiệu suất đỉnh cao. Thiết kế lấy cảm hứng từ năng lượng bất tận của London.',
    buttonText: 'MUA NGAY',
    link: '/products',
    position: 'home_hero',
    order: 1,
    status: 'Đang hoạt động',
    badge: 'NEW ARRIVAL',
    accentColor: '#FF5400',
    startDate: '2026-08-01T00:00',
    endDate: '2026-12-31T23:59',
    createdAt: '01/08/2026',
    updatedAt: '01/08/2026'
  },
  {
    id: 'banner-hero-2',
    name: 'Adidas Ultraboost Light - Năng Lượng',
    image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
    title: 'ADIDAS ULTRABOOST LIGHT',
    subtitle: 'NĂNG LƯỢNG KHÔNG GIỚI HẠN',
    description: 'Phiên bản Ultraboost nhẹ nhất lịch sử chạy bộ. Hoàn trả năng lượng vượt trội kết hợp thân giày Primeknit dệt từ rác thải đại dương tái chế.',
    buttonText: 'TRẢI NGHIỆM NGAY',
    link: '/products',
    position: 'home_hero',
    order: 2,
    status: 'Đang hoạt động',
    badge: 'BEST SELLER',
    accentColor: '#007BC4',
    startDate: '2026-08-01T00:00',
    endDate: '2026-12-31T23:59',
    createdAt: '01/08/2026',
    updatedAt: '01/08/2026'
  },
  {
    id: 'banner-hero-3',
    name: 'Puma RS-X Retro Drift - Nổi Loạn',
    image: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg',
    title: 'PUMA RS-X RETRO DRIFT',
    subtitle: 'TÁO BẠO & KHÁC BIỆT',
    description: 'Thiết kế chunky hầm hố kết hợp những khối màu mang đậm âm hưởng thập niên 80. Sự nổi loạn không khoan nhượng của phong cách vị lai.',
    buttonText: 'KHÁM PHÁ',
    link: '/products',
    position: 'home_hero',
    order: 3,
    status: 'Đang hoạt động',
    badge: 'LIMITED EDITION',
    accentColor: '#D946EF',
    startDate: '2026-08-01T00:00',
    endDate: '2026-12-31T23:59',
    createdAt: '01/08/2026',
    updatedAt: '01/08/2026'
  },
  {
    id: 'banner-promo-1',
    name: 'Mid Season Sale - Giảm đến 30%',
    image: '/src/assets/images/converse_classic_shoe_1784366541899.jpg',
    title: 'GIẢM ĐẾN 30% BỘ SƯU TẬP MỚI',
    subtitle: 'MID-SEASON SALE',
    description: 'Sở hữu ngay những đôi giày sneaker chính hãng hot nhất mùa này với ưu đãi cực đặc biệt. Số lượng có hạn!',
    buttonText: 'KHÁM PHÁ NGAY',
    link: '/products',
    position: 'promo',
    order: 1,
    status: 'Đang hoạt động',
    badge: 'MID-SEASON SALE',
    accentColor: '#F43F5E',
    startDate: '2026-08-01T00:00',
    endDate: '2026-10-31T23:59',
    createdAt: '01/08/2026',
    updatedAt: '01/08/2026'
  },
  {
    id: 'banner-brand-1',
    name: 'Nike Sport Performance - Just Do It',
    image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
    title: 'NIKE SPORT PERFORMANCE',
    subtitle: 'JUST DO IT',
    description: 'Bứt phá mọi giới hạn cùng bộ sưu tập giày thể thao và chạy bộ đỉnh cao từ thương hiệu Nike.',
    buttonText: 'XEM NIKE',
    link: '/products',
    position: 'brand',
    order: 1,
    status: 'Đang hoạt động',
    badge: 'OFFICIAL PARTNER',
    accentColor: '#10B981',
    startDate: '2026-08-01T00:00',
    endDate: '2026-12-31T23:59',
    createdAt: '01/08/2026',
    updatedAt: '01/08/2026'
  },
  {
    id: 'banner-secondary-1',
    name: 'Pro Running Gear Collection',
    image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
    title: 'PRO RUNNING GEAR',
    subtitle: 'SIÊU NHẸ & ÊM ÁI',
    description: 'Trang bị hoàn hảo cho cự ly 5K, 10K và Marathon với công nghệ đệm hoàn trả lực tối đa.',
    buttonText: 'CHỌN GIÀY CHẠY',
    link: '/products',
    position: 'secondary',
    order: 1,
    status: 'Đang hoạt động',
    badge: 'PRO RUNNING',
    accentColor: '#3B82F6',
    startDate: '2026-08-01T00:00',
    endDate: '2026-12-31T23:59',
    createdAt: '01/08/2026',
    updatedAt: '01/08/2026'
  }
];

export const DEFAULT_SEED_ORDERS: Order[] = [
  {
    id: 'ord-ss2026081501',
    orderCode: '#SS20260815-01',
    recipientName: 'Trần Minh Anh',
    phone: '0912345678',
    email: 'minhtran@gmail.com',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressDetail: '72 Lê Thánh Tôn',
    fullAddress: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        productId: 'nike-air-max-pulse',
        productName: 'Nike Air Max Pulse',
        image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
        brand: 'Nike',
        size: 42,
        colorName: 'Neon Orange',
        colorHex: '#FF5400',
        quantity: 1,
        unitPrice: 4200000,
        totalPrice: 4200000
      },
      {
        productId: 'converse-chuck-70',
        productName: "Converse Chuck Taylor '70",
        image: '/src/assets/images/converse_classic_shoe_1784366541899.jpg',
        brand: 'Converse',
        size: 41,
        colorName: 'Classic Navy',
        colorHex: '#1E3A8A',
        quantity: 1,
        unitPrice: 2100000,
        totalPrice: 2100000
      }
    ],
    subtotal: 6300000,
    discount: 300000,
    discountCode: 'SOLE10',
    shippingFee: 0,
    shippingMethod: 'express',
    paymentMethod: 'momo',
    paymentStatus: 'Đã thanh toán',
    transactionId: 'MM20260815001',
    grandTotal: 6000000,
    note: 'Giao trong ngày giúp mình nhé.',
    orderDate: '15/08/2026 - 10:15',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026081502',
    orderCode: '#SS20260815-02',
    recipientName: 'Lê Hoàng Long',
    phone: '0933445566',
    email: 'hoanglong.le@gmail.com',
    province: 'Hà Nội',
    district: 'Quận Hoàn Kiếm',
    ward: 'Phường Tràng Tiền',
    addressDetail: '12 Ngô Quyền',
    fullAddress: '12 Ngô Quyền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    items: [
      {
        productId: 'adidas-ultraboost-light',
        productName: 'Adidas Ultraboost Light',
        image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
        brand: 'Adidas',
        size: 43,
        colorName: 'Core Black',
        colorHex: '#111111',
        quantity: 1,
        unitPrice: 5200000,
        totalPrice: 5200000
      }
    ],
    subtotal: 5200000,
    discount: 300000,
    discountCode: 'SOLE300',
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'banking',
    paymentStatus: 'Đã thanh toán',
    transactionId: 'VCB20260815998',
    grandTotal: 4900000,
    orderDate: '15/08/2026 - 08:45',
    status: 'Đang giao'
  },
  {
    id: 'ord-ss2026081401',
    orderCode: '#SS20260814-01',
    recipientName: 'Đặng Tuấn Anh',
    phone: '0909112233',
    email: 'tuananh.dang@gmail.com',
    province: 'Đà Nẵng',
    district: 'Quận Thanh Khê',
    ward: 'Phường Vĩnh Trung',
    addressDetail: '88 Nguyễn Văn Linh',
    fullAddress: '88 Nguyễn Văn Linh, Phường Vĩnh Trung, Quận Thanh Khê, Đà Nẵng',
    items: [
      {
        productId: 'puma-rsx-retro',
        productName: 'Puma RS-X Retro Drift',
        image: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg',
        brand: 'Puma',
        size: 42,
        colorName: 'Retro Multi',
        colorHex: '#D946EF',
        quantity: 2,
        unitPrice: 3400000,
        totalPrice: 6800000
      }
    ],
    subtotal: 6800000,
    discount: 0,
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    paymentStatus: 'Chưa thanh toán',
    grandTotal: 6800000,
    orderDate: '14/08/2026 - 15:30',
    status: 'Đã xác nhận'
  },
  {
    id: 'ord-ss2026081301',
    orderCode: '#SS20260813-01',
    recipientName: 'Vũ Hải Đăng',
    phone: '0988776655',
    email: 'haidang.vu@gmail.com',
    province: 'Khánh Hòa',
    district: 'Thành phố Nha Trang',
    ward: 'Phường Lộc Thọ',
    addressDetail: '45 Trần Phú',
    fullAddress: '45 Trần Phú, Phường Lộc Thọ, Thành phố Nha Trang, Khánh Hòa',
    items: [
      {
        productId: 'nike-vaporfly-3',
        productName: 'Nike ZoomX Vaporfly 3',
        image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
        brand: 'Nike',
        size: 41,
        colorName: 'Electric Pink',
        colorHex: '#EC4899',
        quantity: 1,
        unitPrice: 6800000,
        totalPrice: 6800000
      }
    ],
    subtotal: 6800000,
    discount: 150000,
    discountCode: 'NIKEVIP50',
    shippingFee: 0,
    shippingMethod: 'express',
    paymentMethod: 'vnpay',
    paymentStatus: 'Đã thanh toán',
    transactionId: 'VNP20260813007',
    grandTotal: 6650000,
    orderDate: '13/08/2026 - 19:20',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026081201',
    orderCode: '#SS20260812-01',
    recipientName: 'Nguyễn Thị Bích Ngọc',
    phone: '0977112244',
    email: 'bichngoc.nt@gmail.com',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 3',
    ward: 'Phường 6',
    addressDetail: '215 Võ Văn Tần',
    fullAddress: '215 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh',
    items: [
      {
        productId: 'adidas-samba-classic',
        productName: 'Adidas Samba Classic',
        image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
        brand: 'Adidas',
        size: 38,
        colorName: 'Core White / Black',
        colorHex: '#F8FAFC',
        quantity: 1,
        unitPrice: 2900000,
        totalPrice: 2900000
      },
      {
        productId: 'converse-run-star',
        productName: 'Converse Run Star Hike',
        image: '/src/assets/images/converse_classic_shoe_1784366541899.jpg',
        brand: 'Converse',
        size: 38,
        colorName: 'White Platform',
        colorHex: '#FFFFFF',
        quantity: 1,
        unitPrice: 2800000,
        totalPrice: 2800000
      }
    ],
    subtotal: 5700000,
    discount: 300000,
    discountCode: 'SOLE10',
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'zalopay',
    paymentStatus: 'Đã thanh toán',
    transactionId: 'ZP20260812011',
    grandTotal: 5400000,
    orderDate: '12/08/2026 - 11:10',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026081001',
    orderCode: '#SS20260810-01',
    recipientName: 'Trần Minh Anh',
    phone: '0912345678',
    email: 'minhtran@gmail.com',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressDetail: '72 Lê Thánh Tôn',
    fullAddress: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        productId: 'puma-future-ultimate',
        productName: 'Puma Future Ultimate FG',
        image: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg',
        brand: 'Puma',
        size: 42,
        colorName: 'Spectral Silver',
        colorHex: '#CBD5E1',
        quantity: 1,
        unitPrice: 5800000,
        totalPrice: 5800000
      }
    ],
    subtotal: 5800000,
    discount: 0,
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'banking',
    paymentStatus: 'Đã thanh toán',
    grandTotal: 5800000,
    orderDate: '10/08/2026 - 16:45',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026080801',
    orderCode: '#SS20260808-01',
    recipientName: 'Nguyễn Văn Nam',
    phone: '0903332211',
    email: 'nam.nguyen@gmail.com',
    province: 'Cần Thơ',
    district: 'Quận Ninh Kiều',
    ward: 'Phường An Cư',
    addressDetail: '15 Đại lộ Hòa Bình',
    fullAddress: '15 Đại lộ Hòa Bình, Phường An Cư, Quận Ninh Kiều, Cần Thơ',
    items: [
      {
        productId: 'nike-air-max-pulse',
        productName: 'Nike Air Max Pulse',
        image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
        brand: 'Nike',
        size: 43,
        colorName: 'Slate Grey',
        colorHex: '#64748B',
        quantity: 1,
        unitPrice: 4200000,
        totalPrice: 4200000
      }
    ],
    subtotal: 4200000,
    discount: 150000,
    discountCode: 'NIKEVIP50',
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    paymentStatus: 'Chưa thanh toán',
    grandTotal: 4050000,
    orderDate: '08/08/2026 - 09:30',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026080501',
    orderCode: '#SS20260805-01',
    recipientName: 'Hoàng Quốc Bảo',
    phone: '0945678901',
    email: 'bao.hoang@gmail.com',
    province: 'Hải Phòng',
    district: 'Quận Lê Chân',
    ward: 'Phường An Biên',
    addressDetail: '60 Mê Linh',
    fullAddress: '60 Mê Linh, Phường An Biên, Quận Lê Chân, Hải Phòng',
    items: [
      {
        productId: 'adidas-predator-elite',
        productName: 'Adidas Predator Accuracy',
        image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
        brand: 'Adidas',
        size: 41,
        colorName: 'Solar Red',
        colorHex: '#EF4444',
        quantity: 1,
        unitPrice: 6200000,
        totalPrice: 6200000
      }
    ],
    subtotal: 6200000,
    discount: 0,
    shippingFee: 30000,
    shippingMethod: 'express',
    paymentMethod: 'cod',
    grandTotal: 6230000,
    orderDate: '05/08/2026 - 14:00',
    status: 'Đã hủy',
    cancelReason: 'Khách hàng đổi ý mua mẫu khác.',
    cancelDate: '05/08/2026 - 15:30'
  },
  {
    id: 'ord-ss2026072801',
    orderCode: '#SS20260728-01',
    recipientName: 'Lê Hoàng Long',
    phone: '0933445566',
    email: 'hoanglong.le@gmail.com',
    province: 'Hà Nội',
    district: 'Quận Hoàn Kiếm',
    ward: 'Phường Tràng Tiền',
    addressDetail: '12 Ngô Quyền',
    fullAddress: '12 Ngô Quyền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    items: [
      {
        productId: 'nike-phantom-gx',
        productName: 'Nike Phantom GX II Academy',
        image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
        brand: 'Nike',
        size: 42,
        colorName: 'Hyper Turquoise',
        colorHex: '#2DD4BF',
        quantity: 1,
        unitPrice: 3200000,
        totalPrice: 3200000
      }
    ],
    subtotal: 3200000,
    discount: 150000,
    discountCode: 'NIKEVIP50',
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'banking',
    paymentStatus: 'Đã thanh toán',
    grandTotal: 3050000,
    orderDate: '28/07/2026 - 17:15',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026072201',
    orderCode: '#SS20260722-01',
    recipientName: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'example@gmail.com',
    province: 'Khánh Hòa',
    district: 'Thành phố Nha Trang',
    ward: 'Phường Phương Sài',
    addressDetail: '45 Yersin',
    fullAddress: '45 Yersin, Phường Phương Sài, Thành phố Nha Trang, Khánh Hòa',
    items: [
      {
        productId: 'puma-rsx-retro',
        productName: 'Puma RS-X Retro Drift',
        image: '/src/assets/images/puma_rsx_shoe_1784366528717.jpg',
        brand: 'Puma',
        size: 41,
        colorName: 'Retro Multi',
        colorHex: '#D946EF',
        quantity: 1,
        unitPrice: 3400000,
        totalPrice: 3400000
      }
    ],
    subtotal: 3400000,
    discount: 300000,
    discountCode: 'SOLE300',
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'banking',
    paymentStatus: 'Đã thanh toán',
    transactionId: 'FT20260722001',
    grandTotal: 3100000,
    orderDate: '22/07/2026 - 14:15',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026071801',
    orderCode: '#SS20260718-01',
    recipientName: 'Đặng Tuấn Anh',
    phone: '0909112233',
    email: 'tuananh.dang@gmail.com',
    province: 'Đà Nẵng',
    district: 'Quận Thanh Khê',
    ward: 'Phường Vĩnh Trung',
    addressDetail: '88 Nguyễn Văn Linh',
    fullAddress: '88 Nguyễn Văn Linh, Phường Vĩnh Trung, Quận Thanh Khê, Đà Nẵng',
    items: [
      {
        productId: 'converse-chuck-70',
        productName: "Converse Chuck Taylor '70",
        image: '/src/assets/images/converse_classic_shoe_1784366541899.jpg',
        brand: 'Converse',
        size: 40,
        colorName: 'Vintage Black',
        colorHex: '#1C1917',
        quantity: 2,
        unitPrice: 2100000,
        totalPrice: 4200000
      }
    ],
    subtotal: 4200000,
    discount: 0,
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'momo',
    paymentStatus: 'Đã thanh toán',
    transactionId: 'MM20260718009',
    grandTotal: 4200000,
    orderDate: '18/07/2026 - 09:10',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026071001',
    orderCode: '#SS20260710-01',
    recipientName: 'Phạm Phương Thảo',
    phone: '0977889900',
    email: 'phuongthao.pham@gmail.com',
    province: 'Khánh Hòa',
    district: 'Thành phố Nha Trang',
    ward: 'Phường Lộc Thọ',
    addressDetail: '45 Trần Phú',
    fullAddress: '45 Trần Phú, Phường Lộc Thọ, Thành phố Nha Trang, Khánh Hòa',
    items: [
      {
        productId: 'adidas-samba-classic',
        productName: 'Adidas Samba Classic',
        image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
        brand: 'Adidas',
        size: 37,
        colorName: 'Core White / Black',
        colorHex: '#F8FAFC',
        quantity: 1,
        unitPrice: 2900000,
        totalPrice: 2900000
      }
    ],
    subtotal: 2900000,
    discount: 290000,
    discountCode: 'SOLE10',
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'banking',
    paymentStatus: 'Đã thanh toán',
    grandTotal: 2610000,
    orderDate: '10/07/2026 - 10:20',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026062001',
    orderCode: '#SS20260620-01',
    recipientName: 'Trần Minh Anh',
    phone: '0912345678',
    email: 'minhtran@gmail.com',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressDetail: '72 Lê Thánh Tôn',
    fullAddress: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        productId: 'nike-air-max-pulse',
        productName: 'Nike Air Max Pulse',
        image: '/src/assets/images/nike_hero_shoe_1784366503176.jpg',
        brand: 'Nike',
        size: 42,
        colorName: 'Neon Orange',
        colorHex: '#FF5400',
        quantity: 1,
        unitPrice: 4200000,
        totalPrice: 4200000
      }
    ],
    subtotal: 4200000,
    discount: 400000,
    discountCode: 'SUMMERSALE',
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'momo',
    paymentStatus: 'Đã thanh toán',
    grandTotal: 3800000,
    orderDate: '20/06/2026 - 15:40',
    status: 'Đã giao'
  },
  {
    id: 'ord-ss2026051501',
    orderCode: '#SS20260515-01',
    recipientName: 'Lê Hoàng Long',
    phone: '0933445566',
    email: 'hoanglong.le@gmail.com',
    province: 'Hà Nội',
    district: 'Quận Hoàn Kiếm',
    ward: 'Phường Tràng Tiền',
    addressDetail: '12 Ngô Quyền',
    fullAddress: '12 Ngô Quyền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    items: [
      {
        productId: 'adidas-ultraboost-light',
        productName: 'Adidas Ultraboost Light',
        image: '/src/assets/images/adidas_black_shoe_1784366517769.jpg',
        brand: 'Adidas',
        size: 43,
        colorName: 'Cloud White',
        colorHex: '#FFFFFF',
        quantity: 1,
        unitPrice: 5200000,
        totalPrice: 5200000
      }
    ],
    subtotal: 5200000,
    discount: 0,
    shippingFee: 0,
    shippingMethod: 'standard',
    paymentMethod: 'banking',
    paymentStatus: 'Đã thanh toán',
    grandTotal: 5200000,
    orderDate: '15/05/2026 - 18:00',
    status: 'Đã giao'
  }
];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-001',
    fullName: 'Hoàng Nhật Minh',
    email: 'nhatminh.hoang@gmail.com',
    phone: '0912345678',
    subject: 'Tư vấn chọn size giày Nike Air Max Pulse',
    content: 'Chào shop, chiều dài bàn chân mình là 26.5cm, mu bàn chân hơi dày thì nên mang size 42 hay 42.5 của dòng Nike Air Max Pulse này ạ?',
    createdAt: '20/08/2026 10:15',
    status: 'Đã phản hồi',
    replyNote: 'Đã gọi điện và tư vấn khách chọn size 42.5.'
  },
  {
    id: 'msg-002',
    fullName: 'Lê Thu Trang',
    email: 'thutrang.le@gmail.com',
    phone: '0988776655',
    subject: 'Chính sách đổi trả tại showroom',
    content: 'Mình đặt hàng online và nhận giày hôm qua nhưng muốn mang trực tiếp ra showroom tại Lê Lợi để đổi màu khác có được không shop?',
    createdAt: '21/08/2026 08:45',
    status: 'Chưa xử lý'
  }
];


