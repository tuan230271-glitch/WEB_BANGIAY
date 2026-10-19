export interface Ward {
  id: string;
  name: string;
  type?: 'phuong' | 'xa' | 'dac_khu';
}

export interface AdministrativeProvince {
  id: string;
  name: string;
  wards: Ward[];
}

// Legacy interfaces for backwards compatibility
export interface District {
  name: string;
  wards: string[];
}
export interface Province {
  name: string;
  districts: District[];
}

export const ADMINISTRATIVE_PROVINCES: AdministrativeProvince[] = [
  {
    id: 'p-hn',
    name: 'Hà Nội',
    wards: [
      { id: 'w-hn-01', name: 'Phường Tràng Tiền', type: 'phuong' },
      { id: 'w-hn-02', name: 'Phường Hàng Bạc', type: 'phuong' },
      { id: 'w-hn-03', name: 'Phường Cửa Đông', type: 'phuong' },
      { id: 'w-hn-04', name: 'Phường Kim Mã', type: 'phuong' },
      { id: 'w-hn-05', name: 'Phường Giảng Võ', type: 'phuong' },
      { id: 'w-hn-06', name: 'Phường Dịch Vọng', type: 'phuong' },
      { id: 'w-hn-07', name: 'Phường Yên Hòa', type: 'phuong' },
      { id: 'w-hn-08', name: 'Phường Văn Miếu', type: 'phuong' },
      { id: 'w-hn-09', name: 'Phường Láng Hạ', type: 'phuong' },
      { id: 'w-hn-10', name: 'Phường Mỹ Đình 1', type: 'phuong' },
      { id: 'w-hn-11', name: 'Phường Mễ Trì', type: 'phuong' },
      { id: 'w-hn-12', name: 'Phường Bưởi', type: 'phuong' },
      { id: 'w-hn-13', name: 'Phường Bạch Đằng', type: 'phuong' },
      { id: 'w-hn-14', name: 'Phường Minh Khai', type: 'phuong' },
      { id: 'w-hn-15', name: 'Phường Ô Chợ Dừa', type: 'phuong' },
      { id: 'w-hn-16', name: 'Phường Việt Hưng', type: 'phuong' },
      { id: 'w-hn-17', name: 'Phường Ngọc Lâm', type: 'phuong' },
      { id: 'w-hn-18', name: 'Xã Đông Hội', type: 'xa' },
      { id: 'w-hn-19', name: 'Xã Kim Chung', type: 'xa' },
      { id: 'w-hn-20', name: 'Xã Tân Lập', type: 'xa' },
      { id: 'w-hn-21', name: 'Xã Hòa Lạc', type: 'xa' },
      { id: 'w-hn-22', name: 'Xã Thanh Liệt', type: 'xa' },
      { id: 'w-hn-23', name: 'Xã An Khánh', type: 'xa' }
    ]
  },
  {
    id: 'p-cb',
    name: 'Cao Bằng',
    wards: [
      { id: 'w-cb-01', name: 'Phường Sông Hiến', type: 'phuong' },
      { id: 'w-cb-02', name: 'Phường Đề Thám', type: 'phuong' },
      { id: 'w-cb-03', name: 'Phường Hợp Giang', type: 'phuong' },
      { id: 'w-cb-04', name: 'Phường Tân Giang', type: 'phuong' },
      { id: 'w-cb-05', name: 'Xã Hưng Đạo', type: 'xa' },
      { id: 'w-cb-06', name: 'Xã Chu Trinh', type: 'xa' },
      { id: 'w-cb-07', name: 'Xã Quảng Uyên', type: 'xa' },
      { id: 'w-cb-08', name: 'Xã Độc Lập', type: 'xa' },
      { id: 'w-cb-09', name: 'Xã Bảo Lạc', type: 'xa' },
      { id: 'w-cb-10', name: 'Xã Hà Quảng', type: 'xa' },
      { id: 'w-cb-11', name: 'Xã Trùng Khánh', type: 'xa' },
      { id: 'w-cb-12', name: 'Xã Nguyên Bình', type: 'xa' }
    ]
  },
  {
    id: 'p-tq',
    name: 'Tuyên Quang',
    wards: [
      { id: 'w-tq-01', name: 'Phường Tân Quang', type: 'phuong' },
      { id: 'w-tq-02', name: 'Phường Phan Thiết', type: 'phuong' },
      { id: 'w-tq-03', name: 'Phường Nông Tiến', type: 'phuong' },
      { id: 'w-tq-04', name: 'Phường Minh Xuân', type: 'phuong' },
      { id: 'w-tq-05', name: 'Phường An Tường', type: 'phuong' },
      { id: 'w-tq-06', name: 'Xã Lăng Can', type: 'xa' },
      { id: 'w-tq-07', name: 'Xã Yên Nguyên', type: 'xa' },
      { id: 'w-tq-08', name: 'Xã Chiêm Hóa', type: 'xa' },
      { id: 'w-tq-09', name: 'Xã Hàm Yên', type: 'xa' },
      { id: 'w-tq-10', name: 'Xã Sơn Dương', type: 'xa' },
      { id: 'w-tq-11', name: 'Xã Tân Trào', type: 'xa' }
    ]
  },
  {
    id: 'p-db',
    name: 'Điện Biên',
    wards: [
      { id: 'w-db-01', name: 'Phường Mường Thanh', type: 'phuong' },
      { id: 'w-db-02', name: 'Phường Tân Thanh', type: 'phuong' },
      { id: 'w-db-03', name: 'Phường Him Lam', type: 'phuong' },
      { id: 'w-db-04', name: 'Phường Nam Thanh', type: 'phuong' },
      { id: 'w-db-05', name: 'Xã Thanh Minh', type: 'xa' },
      { id: 'w-db-06', name: 'Xã Nà Tấu', type: 'xa' },
      { id: 'w-db-07', name: 'Xã Điện Biên Đông', type: 'xa' },
      { id: 'w-db-08', name: 'Xã Tuần Giáo', type: 'xa' },
      { id: 'w-db-09', name: 'Xã Tủa Chùa', type: 'xa' },
      { id: 'w-db-10', name: 'Xã Mường Nhé', type: 'xa' },
      { id: 'w-db-11', name: 'Xã Mường Lay', type: 'xa' }
    ]
  },
  {
    id: 'p-lc',
    name: 'Lai Châu',
    wards: [
      { id: 'w-lc-01', name: 'Phường Tân Phong', type: 'phuong' },
      { id: 'w-lc-02', name: 'Phường Quyết Thắng', type: 'phuong' },
      { id: 'w-lc-03', name: 'Phường Đông Phong', type: 'phuong' },
      { id: 'w-lc-04', name: 'Xã San Thàng', type: 'xa' },
      { id: 'w-lc-05', name: 'Xã Tam Đường', type: 'xa' },
      { id: 'w-lc-06', name: 'Xã Phong Thổ', type: 'xa' },
      { id: 'w-lc-07', name: 'Xã Mường Tè', type: 'xa' },
      { id: 'w-lc-08', name: 'Xã Sìn Hồ', type: 'xa' },
      { id: 'w-lc-09', name: 'Xã Tân Uyên', type: 'xa' },
      { id: 'w-lc-10', name: 'Xã Than Uyên', type: 'xa' }
    ]
  },
  {
    id: 'p-sl',
    name: 'Sơn La',
    wards: [
      { id: 'w-sl-01', name: 'Phường Quyết Thắng', type: 'phuong' },
      { id: 'w-sl-02', name: 'Phường Chiềng Lề', type: 'phuong' },
      { id: 'w-sl-03', name: 'Phường Chiềng An', type: 'phuong' },
      { id: 'w-sl-04', name: 'Phường Tô Hiệu', type: 'phuong' },
      { id: 'w-sl-05', name: 'Xã Chiềng Xôm', type: 'xa' },
      { id: 'w-sl-06', name: 'Xã Mộc Châu', type: 'xa' },
      { id: 'w-sl-07', name: 'Xã Vân Hồ', type: 'xa' },
      { id: 'w-sl-08', name: 'Xã Thuận Châu', type: 'xa' },
      { id: 'w-sl-09', name: 'Xã Mường La', type: 'xa' },
      { id: 'w-sl-10', name: 'Xã Mai Sơn', type: 'xa' },
      { id: 'w-sl-11', name: 'Xã Phù Yên', type: 'xa' }
    ]
  },
  {
    id: 'p-laocai',
    name: 'Lào Cai',
    wards: [
      { id: 'w-laocai-01', name: 'Phường Kim Tân', type: 'phuong' },
      { id: 'w-laocai-02', name: 'Phường Bắc Cường', type: 'phuong' },
      { id: 'w-laocai-03', name: 'Phường Nam Cường', type: 'phuong' },
      { id: 'w-laocai-04', name: 'Phường Lào Cai', type: 'phuong' },
      { id: 'w-laocai-05', name: 'Phường Ô Quý Hồ', type: 'phuong' },
      { id: 'w-laocai-06', name: 'Phường Phan Si Păng', type: 'phuong' },
      { id: 'w-laocai-07', name: 'Xã Sa Pa', type: 'xa' },
      { id: 'w-laocai-08', name: 'Xã Bát Xát', type: 'xa' },
      { id: 'w-laocai-09', name: 'Xã Bảo Thắng', type: 'xa' },
      { id: 'w-laocai-10', name: 'Xã Bắc Hà', type: 'xa' },
      { id: 'w-laocai-11', name: 'Xã Văn Bàn', type: 'xa' }
    ]
  },
  {
    id: 'p-tn',
    name: 'Thái Nguyên',
    wards: [
      { id: 'w-tn-01', name: 'Phường Hoàng Văn Thụ', type: 'phuong' },
      { id: 'w-tn-02', name: 'Phường Phan Đình Phùng', type: 'phuong' },
      { id: 'w-tn-03', name: 'Phường Quang Trung', type: 'phuong' },
      { id: 'w-tn-04', name: 'Phường Gia Sáng', type: 'phuong' },
      { id: 'w-tn-05', name: 'Phường Tân Lập', type: 'phuong' },
      { id: 'w-tn-06', name: 'Phường Cải Đan', type: 'phuong' },
      { id: 'w-tn-07', name: 'Xã Sông Công', type: 'xa' },
      { id: 'w-tn-08', name: 'Xã Phổ Yên', type: 'xa' },
      { id: 'w-tn-09', name: 'Xã Định Hóa', type: 'xa' },
      { id: 'w-tn-10', name: 'Xã Phú Lương', type: 'xa' },
      { id: 'w-tn-11', name: 'Xã Đại Từ', type: 'xa' }
    ]
  },
  {
    id: 'p-ls',
    name: 'Lạng Sơn',
    wards: [
      { id: 'w-ls-01', name: 'Phường Vĩnh Trại', type: 'phuong' },
      { id: 'w-ls-02', name: 'Phường Tam Thanh', type: 'phuong' },
      { id: 'w-ls-03', name: 'Phường Hoàng Văn Thụ', type: 'phuong' },
      { id: 'w-ls-04', name: 'Phường Đông Kinh', type: 'phuong' },
      { id: 'w-ls-05', name: 'Xã Chi Lăng', type: 'xa' },
      { id: 'w-ls-06', name: 'Xã Hữu Lũng', type: 'xa' },
      { id: 'w-ls-07', name: 'Xã Văn Lãng', type: 'xa' },
      { id: 'w-ls-08', name: 'Xã Cao Lộc', type: 'xa' },
      { id: 'w-ls-09', name: 'Xã Lộc Bình', type: 'xa' },
      { id: 'w-ls-10', name: 'Xã Đình Lập', type: 'xa' }
    ]
  },
  {
    id: 'p-qn',
    name: 'Quảng Ninh',
    wards: [
      { id: 'w-qn-01', name: 'Phường Bãi Cháy', type: 'phuong' },
      { id: 'w-qn-02', name: 'Phường Hồng Gai', type: 'phuong' },
      { id: 'w-qn-03', name: 'Phường Cao Xanh', type: 'phuong' },
      { id: 'w-qn-04', name: 'Phường Hà Tu', type: 'phuong' },
      { id: 'w-qn-05', name: 'Phường Móng Cái', type: 'phuong' },
      { id: 'w-qn-06', name: 'Phường Cẩm Pha', type: 'phuong' },
      { id: 'w-qn-07', name: 'Phường Uông Bí', type: 'phuong' },
      { id: 'w-qn-08', name: 'Xã Vân Đồn', type: 'xa' },
      { id: 'w-qn-09', name: 'Xã Cô Tô', type: 'xa' },
      { id: 'w-qn-10', name: 'Xã Đông Triều', type: 'xa' },
      { id: 'w-qn-11', name: 'Xã Quảng Yên', type: 'xa' }
    ]
  },
  {
    id: 'p-bn',
    name: 'Bắc Ninh',
    wards: [
      { id: 'w-bn-01', name: 'Phường Suối Hoa', type: 'phuong' },
      { id: 'w-bn-02', name: 'Phường Tiền An', type: 'phuong' },
      { id: 'w-bn-03', name: 'Phường Võ Cường', type: 'phuong' },
      { id: 'w-bn-04', name: 'Phường Ninh Xá', type: 'phuong' },
      { id: 'w-bn-05', name: 'Phường Từ Sơn', type: 'phuong' },
      { id: 'w-bn-06', name: 'Phường Đồng Nguyên', type: 'phuong' },
      { id: 'w-bn-07', name: 'Xã Thuận Thành', type: 'xa' },
      { id: 'w-bn-08', name: 'Xã Quế Võ', type: 'xa' },
      { id: 'w-bn-09', name: 'Xã Tiên Du', type: 'xa' },
      { id: 'w-bn-10', name: 'Xã Yên Phong', type: 'xa' },
      { id: 'w-bn-11', name: 'Xã Gia Bình', type: 'xa' }
    ]
  },
  {
    id: 'p-pt',
    name: 'Phú Thọ',
    wards: [
      { id: 'w-pt-01', name: 'Phường Tiên Dung', type: 'phuong' },
      { id: 'w-pt-02', name: 'Phường Nông Trang', type: 'phuong' },
      { id: 'w-pt-03', name: 'Phường Vân Phú', type: 'phuong' },
      { id: 'w-pt-04', name: 'Phường Gia Cẩm', type: 'phuong' },
      { id: 'w-pt-05', name: 'Phường Việt Trì', type: 'phuong' },
      { id: 'w-pt-06', name: 'Xã Đền Hùng', type: 'xa' },
      { id: 'w-pt-07', name: 'Xã Lâm Thao', type: 'xa' },
      { id: 'w-pt-08', name: 'Xã Thịnh Lăng', type: 'xa' },
      { id: 'w-pt-09', name: 'Xã Thanh Sơn', type: 'xa' },
      { id: 'w-pt-10', name: 'Xã Đoan Hùng', type: 'xa' },
      { id: 'w-pt-11', name: 'Xã Cẩm Khê', type: 'xa' }
    ]
  },
  {
    id: 'p-hp',
    name: 'Hải Phòng',
    wards: [
      { id: 'w-hp-01', name: 'Phường Hoàng Văn Thụ', type: 'phuong' },
      { id: 'w-hp-02', name: 'Phường Lạch Tray', type: 'phuong' },
      { id: 'w-hp-03', name: 'Phường Cầu Đất', type: 'phuong' },
      { id: 'w-hp-04', name: 'Phường Máy Tơ', type: 'phuong' },
      { id: 'w-hp-05', name: 'Phường Đằng Lâm', type: 'phuong' },
      { id: 'w-hp-06', name: 'Phường Quán Toan', type: 'phuong' },
      { id: 'w-hp-07', name: 'Phường Đồ Sơn', type: 'phuong' },
      { id: 'w-hp-08', name: 'Phường Cát Bà', type: 'phuong' },
      { id: 'w-hp-09', name: 'Đặc khu Cát Hải', type: 'dac_khu' },
      { id: 'w-hp-10', name: 'Xã An Dương', type: 'xa' },
      { id: 'w-hp-11', name: 'Xã Thủy Nguyên', type: 'xa' }
    ]
  },
  {
    id: 'p-hy',
    name: 'Hưng Yên',
    wards: [
      { id: 'w-hy-01', name: 'Phường Hiến Nam', type: 'phuong' },
      { id: 'w-hy-02', name: 'Phường Lam Sơn', type: 'phuong' },
      { id: 'w-hy-03', name: 'Phường An Tảo', type: 'phuong' },
      { id: 'w-hy-04', name: 'Xã Văn Giang', type: 'xa' },
      { id: 'w-hy-05', name: 'Xã Ecopark', type: 'xa' },
      { id: 'w-hy-06', name: 'Xã Mỹ Hào', type: 'xa' },
      { id: 'w-hy-07', name: 'Xã Yên Mỹ', type: 'xa' },
      { id: 'w-hy-08', name: 'Xã Ân Thi', type: 'xa' },
      { id: 'w-hy-09', name: 'Xã Khoái Châu', type: 'xa' },
      { id: 'w-hy-10', name: 'Xã Kim Động', type: 'xa' }
    ]
  },
  {
    id: 'p-nb',
    name: 'Ninh Bình',
    wards: [
      { id: 'w-nb-01', name: 'Phường Vân Giang', type: 'phuong' },
      { id: 'w-nb-02', name: 'Phường Bích Đào', type: 'phuong' },
      { id: 'w-nb-03', name: 'Phường Nam Thành', type: 'phuong' },
      { id: 'w-nb-04', name: 'Phường Tây Sơn', type: 'phuong' },
      { id: 'w-nb-05', name: 'Xã Tràng An', type: 'xa' },
      { id: 'w-nb-06', name: 'Xã Bái Đính', type: 'xa' },
      { id: 'w-nb-07', name: 'Xã Tam Điệp', type: 'xa' },
      { id: 'w-nb-08', name: 'Xã Kim Sơn', type: 'xa' },
      { id: 'w-nb-09', name: 'Xã Gia Viễn', type: 'xa' },
      { id: 'w-nb-10', name: 'Xã Hoa Lư', type: 'xa' }
    ]
  },
  {
    id: 'p-th',
    name: 'Thanh Hóa',
    wards: [
      { id: 'w-th-01', name: 'Phường Ba Đình', type: 'phuong' },
      { id: 'w-th-02', name: 'Phường Đông Thọ', type: 'phuong' },
      { id: 'w-th-03', name: 'Phường Điện Biên', type: 'phuong' },
      { id: 'w-th-04', name: 'Phường Sầm Sơn', type: 'phuong' },
      { id: 'w-th-05', name: 'Phường Bỉm Sơn', type: 'phuong' },
      { id: 'w-th-06', name: 'Xã Đông Sơn', type: 'xa' },
      { id: 'w-th-07', name: 'Xã Quảng Xương', type: 'xa' },
      { id: 'w-th-08', name: 'Xã Hoằng Hóa', type: 'xa' },
      { id: 'w-th-09', name: 'Xã Tĩnh Gia', type: 'xa' },
      { id: 'w-th-10', name: 'Xã Thọ Xuân', type: 'xa' },
      { id: 'w-th-11', name: 'Xã Triệu Sơn', type: 'xa' }
    ]
  },
  {
    id: 'p-na',
    name: 'Nghệ An',
    wards: [
      { id: 'w-na-01', name: 'Phường Hưng Dũng', type: 'phuong' },
      { id: 'w-na-02', name: 'Phường Bến Thủy', type: 'phuong' },
      { id: 'w-na-03', name: 'Phường Quang Trung', type: 'phuong' },
      { id: 'w-na-04', name: 'Phường Trường Thi', type: 'phuong' },
      { id: 'w-na-05', name: 'Phường Cửa Lộ', type: 'phuong' },
      { id: 'w-na-06', name: 'Phường Cửa Hội', type: 'phuong' },
      { id: 'w-na-07', name: 'Xã Diễn Châu', type: 'xa' },
      { id: 'w-na-08', name: 'Xã Quỳnh Lưu', type: 'xa' },
      { id: 'w-na-09', name: 'Xã Nam Đàn', type: 'xa' },
      { id: 'w-na-10', name: 'Xã Đô Lương', type: 'xa' },
      { id: 'w-na-11', name: 'Xã Thái Hòa', type: 'xa' }
    ]
  },
  {
    id: 'p-ht',
    name: 'Hà Tĩnh',
    wards: [
      { id: 'w-ht-01', name: 'Phường Trần Phú', type: 'phuong' },
      { id: 'w-ht-02', name: 'Phường Bắc Hà', type: 'phuong' },
      { id: 'w-ht-03', name: 'Phường Nam Hà', type: 'phuong' },
      { id: 'w-ht-04', name: 'Phường Kỳ Anh', type: 'phuong' },
      { id: 'w-ht-05', name: 'Xã Cẩm Xuyên', type: 'xa' },
      { id: 'w-ht-06', name: 'Xã Can Lộc', type: 'xa' },
      { id: 'w-ht-07', name: 'Xã Hương Sơn', type: 'xa' },
      { id: 'w-ht-08', name: 'Xã Đức Thọ', type: 'xa' },
      { id: 'w-ht-09', name: 'Xã Nghi Xuân', type: 'xa' },
      { id: 'w-ht-10', name: 'Xã Thạch Hà', type: 'xa' }
    ]
  },
  {
    id: 'p-qt',
    name: 'Quảng Trị',
    wards: [
      { id: 'w-qt-01', name: 'Phường Đông Lương', type: 'phuong' },
      { id: 'w-qt-02', name: 'Phường Đông Hà', type: 'phuong' },
      { id: 'w-qt-03', name: 'Phường 1', type: 'phuong' },
      { id: 'w-qt-04', name: 'Xã Cửa Tùng', type: 'xa' },
      { id: 'w-qt-05', name: 'Xã Hướng Hóa', type: 'xa' },
      { id: 'w-qt-06', name: 'Xã Cam Lộ', type: 'xa' },
      { id: 'w-qt-07', name: 'Xã Gio Linh', type: 'xa' },
      { id: 'w-qt-08', name: 'Xã Triệu Phong', type: 'xa' },
      { id: 'w-qt-09', name: 'Xã Hải Lăng', type: 'xa' },
      { id: 'w-qt-10', name: 'Đặc khu Cồn Cỏ', type: 'dac_khu' }
    ]
  },
  {
    id: 'p-hue',
    name: 'Huế',
    wards: [
      { id: 'w-hue-01', name: 'Phường Phú Hội', type: 'phuong' },
      { id: 'w-hue-02', name: 'Phường Thuận Thành', type: 'phuong' },
      { id: 'w-hue-03', name: 'Phường Vĩnh Ninh', type: 'phuong' },
      { id: 'w-hue-04', name: 'Phường Hương Sơ', type: 'phuong' },
      { id: 'w-hue-05', name: 'Phường Lăng Cô', type: 'phuong' },
      { id: 'w-hue-06', name: 'Xã A Luối', type: 'xa' },
      { id: 'w-hue-07', name: 'Xã Phong Điền', type: 'xa' },
      { id: 'w-hue-08', name: 'Xã Quảng Điền', type: 'xa' },
      { id: 'w-hue-09', name: 'Xã Phú Vang', type: 'xa' },
      { id: 'w-hue-10', name: 'Xã Nam Đông', type: 'xa' }
    ]
  },
  {
    id: 'p-dn',
    name: 'Đà Nẵng',
    wards: [
      { id: 'w-dn-01', name: 'Phường Hải Châu 1', type: 'phuong' },
      { id: 'w-dn-02', name: 'Phường Thạch Thang', type: 'phuong' },
      { id: 'w-dn-03', name: 'Phường Phước Ninh', type: 'phuong' },
      { id: 'w-dn-04', name: 'Phường Hòa Cường Bắc', type: 'phuong' },
      { id: 'w-dn-05', name: 'Phường An Hải Bắc', type: 'phuong' },
      { id: 'w-dn-06', name: 'Phường Phước Mỹ', type: 'phuong' },
      { id: 'w-dn-07', name: 'Phường Thọ Quang', type: 'phuong' },
      { id: 'w-dn-08', name: 'Phường Khuê Trung', type: 'phuong' },
      { id: 'w-dn-09', name: 'Xã Hòa Vang', type: 'xa' },
      { id: 'w-dn-10', name: 'Đặc khu Hoàng Sa', type: 'dac_khu' }
    ]
  },
  {
    id: 'p-qng',
    name: 'Quảng Ngãi',
    wards: [
      { id: 'w-qng-01', name: 'Phường Trần Phú', type: 'phuong' },
      { id: 'w-qng-02', name: 'Phường Chánh Lộ', type: 'phuong' },
      { id: 'w-qng-03', name: 'Phường Nghĩa Chánh', type: 'phuong' },
      { id: 'w-qng-04', name: 'Xã Lý Sơn', type: 'xa' },
      { id: 'w-qng-05', name: 'Đặc khu Lý Sơn', type: 'dac_khu' },
      { id: 'w-qng-06', name: 'Xã Bình Sơn', type: 'xa' },
      { id: 'w-qng-07', name: 'Xã Sơn Tịnh', type: 'xa' },
      { id: 'w-qng-08', name: 'Xã Đức Phổ', type: 'xa' },
      { id: 'w-qng-09', name: 'Xã Tư Nghĩa', type: 'xa' },
      { id: 'w-qng-10', name: 'Xã Ba Tơ', type: 'xa' }
    ]
  },
  {
    id: 'p-gl',
    name: 'Gia Lai',
    wards: [
      { id: 'w-gl-01', name: 'Phường Tây Sơn', type: 'phuong' },
      { id: 'w-gl-02', name: 'Phường Hoa Lư', type: 'phuong' },
      { id: 'w-gl-03', name: 'Phường Hội Thương', type: 'phuong' },
      { id: 'w-gl-04', name: 'Phường Ia Kring', type: 'phuong' },
      { id: 'w-gl-05', name: 'Phường An Khê', type: 'phuong' },
      { id: 'w-gl-06', name: 'Xã Ayun Pa', type: 'xa' },
      { id: 'w-gl-07', name: 'Xã Chư Sê', type: 'xa' },
      { id: 'w-gl-08', name: 'Xã Chư Prông', type: 'xa' },
      { id: 'w-gl-09', name: 'Xã Krông Pa', type: 'xa' },
      { id: 'w-gl-10', name: 'Xã Đak Đoa', type: 'xa' }
    ]
  },
  {
    id: 'p-kh',
    name: 'Khánh Hòa',
    wards: [
      { id: 'w-kh-01', name: 'Phường Lộc Thọ', type: 'phuong' },
      { id: 'w-kh-02', name: 'Phường Phương Sài', type: 'phuong' },
      { id: 'w-kh-03', name: 'Phường Vĩnh Hải', type: 'phuong' },
      { id: 'w-kh-04', name: 'Phường Phước Hải', type: 'phuong' },
      { id: 'w-kh-05', name: 'Phường Nha Trang', type: 'phuong' },
      { id: 'w-kh-06', name: 'Phường Cam Ranh', type: 'phuong' },
      { id: 'w-kh-07', name: 'Phường Ninh Hòa', type: 'phuong' },
      { id: 'w-kh-08', name: 'Xã Diên Khánh', type: 'xa' },
      { id: 'w-kh-09', name: 'Xã Vĩnh Ngọc', type: 'xa' },
      { id: 'w-kh-10', name: 'Đặc khu Trường Sa', type: 'dac_khu' }
    ]
  },
  {
    id: 'p-dl',
    name: 'Đắk Lắk',
    wards: [
      { id: 'w-dl-01', name: 'Phường Tân Lợi', type: 'phuong' },
      { id: 'w-dl-02', name: 'Phường Thắng Lợi', type: 'phuong' },
      { id: 'w-dl-03', name: 'Phường Tự An', type: 'phuong' },
      { id: 'w-dl-04', name: 'Phường Tân Tiến', type: 'phuong' },
      { id: 'w-dl-05', name: 'Phường Buôn Hồ', type: 'phuong' },
      { id: 'w-dl-06', name: 'Xã Buôn Đôn', type: 'xa' },
      { id: 'w-dl-07', name: 'Xã Krông Pắc', type: 'xa' },
      { id: 'w-dl-08', name: 'Xã Cư M\'gar', type: 'xa' },
      { id: 'w-dl-09', name: 'Xã Ea H\'leo', type: 'xa' },
      { id: 'w-dl-10', name: 'Xã Krông Ana', type: 'xa' }
    ]
  },
  {
    id: 'p-ld',
    name: 'Lâm Đồng',
    wards: [
      { id: 'w-ld-01', name: 'Phường 1 Đà Lạt', type: 'phuong' },
      { id: 'w-ld-02', name: 'Phường 2 Đà Lạt', type: 'phuong' },
      { id: 'w-ld-03', name: 'Phường 3 Đà Lạt', type: 'phuong' },
      { id: 'w-ld-04', name: 'Phường Bảo Lộc', type: 'phuong' },
      { id: 'w-ld-05', name: 'Phường Lộc Phát', type: 'phuong' },
      { id: 'w-ld-06', name: 'Xã Lạc Dương', type: 'xa' },
      { id: 'w-ld-07', name: 'Xã Đức Trọng', type: 'xa' },
      { id: 'w-ld-08', name: 'Xã Di Linh', type: 'xa' },
      { id: 'w-ld-09', name: 'Xã Đơn Dương', type: 'xa' },
      { id: 'w-ld-10', name: 'Xã Đạ Huoai', type: 'xa' }
    ]
  },
  {
    id: 'p-dongnai',
    name: 'Đồng Nai',
    wards: [
      { id: 'w-dongnai-01', name: 'Phường Trảng Dài', type: 'phuong' },
      { id: 'w-dongnai-02', name: 'Phường Tân Phong', type: 'phuong' },
      { id: 'w-dongnai-03', name: 'Phường Quyết Thắng', type: 'phuong' },
      { id: 'w-dongnai-04', name: 'Phường Hố Nai', type: 'phuong' },
      { id: 'w-dongnai-05', name: 'Phường Long Bình', type: 'phuong' },
      { id: 'w-dongnai-06', name: 'Phường Long Khánh', type: 'phuong' },
      { id: 'w-dongnai-07', name: 'Xã Long Thành', type: 'xa' },
      { id: 'w-dongnai-08', name: 'Xã Nhơn Trạch', type: 'xa' },
      { id: 'w-dongnai-09', name: 'Xã Trảng Bom', type: 'xa' },
      { id: 'w-dongnai-10', name: 'Xã Định Quán', type: 'xa' }
    ]
  },
  {
    id: 'p-hcm',
    name: 'Thành phố Hồ Chí Minh',
    wards: [
      { id: 'w-hcm-01', name: 'Phường Bến Nghé', type: 'phuong' },
      { id: 'w-hcm-02', name: 'Phường Bến Thành', type: 'phuong' },
      { id: 'w-hcm-03', name: 'Phường Võ Thị Sáu', type: 'phuong' },
      { id: 'w-hcm-04', name: 'Phường Tân Phong', type: 'phuong' },
      { id: 'w-hcm-05', name: 'Phường Thảo Điền', type: 'phuong' },
      { id: 'w-hcm-06', name: 'Phường An Phú', type: 'phuong' },
      { id: 'w-hcm-07', name: 'Phường Hiệp Bình Chánh', type: 'phuong' },
      { id: 'w-hcm-08', name: 'Phường 25 Bình Thạnh', type: 'phuong' },
      { id: 'w-hcm-09', name: 'Phường Tân Sơn Nhất', type: 'phuong' },
      { id: 'w-hcm-10', name: 'Phường An Lạc', type: 'phuong' },
      { id: 'w-hcm-11', name: 'Xã Củ Chi', type: 'xa' },
      { id: 'w-hcm-12', name: 'Xã Hóc Môn', type: 'xa' },
      { id: 'w-hcm-13', name: 'Xã Bình Chánh', type: 'xa' },
      { id: 'w-hcm-14', name: 'Đặc khu Cần Giờ', type: 'dac_khu' }
    ]
  },
  {
    id: 'p-tninh',
    name: 'Tây Ninh',
    wards: [
      { id: 'w-tninh-01', name: 'Phường 1 Tây Ninh', type: 'phuong' },
      { id: 'w-tninh-02', name: 'Phường 3 Tây Ninh', type: 'phuong' },
      { id: 'w-tninh-03', name: 'Phường Hiệp Ninh', type: 'phuong' },
      { id: 'w-tninh-04', name: 'Phường Trảng Bàng', type: 'phuong' },
      { id: 'w-tninh-05', name: 'Phường Hòa Thành', type: 'phuong' },
      { id: 'w-tninh-06', name: 'Xã Gò Dầu', type: 'xa' },
      { id: 'w-tninh-07', name: 'Xã Bến Cầu', type: 'xa' },
      { id: 'w-tninh-08', name: 'Xã Tân Biên', type: 'xa' },
      { id: 'w-tninh-09', name: 'Xã Tân Châu', type: 'xa' },
      { id: 'w-tninh-10', name: 'Xã Dương Minh Châu', type: 'xa' }
    ]
  },
  {
    id: 'p-ct',
    name: 'Cần Thơ',
    wards: [
      { id: 'w-ct-01', name: 'Phường An Khánh', type: 'phuong' },
      { id: 'w-ct-02', name: 'Phường Tân An', type: 'phuong' },
      { id: 'w-ct-03', name: 'Phường Xuân Khánh', type: 'phuong' },
      { id: 'w-ct-04', name: 'Phường An Hòa', type: 'phuong' },
      { id: 'w-ct-05', name: 'Phường Bình Thủy', type: 'phuong' },
      { id: 'w-ct-06', name: 'Phường Cái Răng', type: 'phuong' },
      { id: 'w-ct-07', name: 'Phường Thốt Nốt', type: 'phuong' },
      { id: 'w-ct-08', name: 'Xã Phong Điền', type: 'xa' },
      { id: 'w-ct-09', name: 'Xã Thới Lai', type: 'xa' },
      { id: 'w-ct-10', name: 'Xã Cờ Đỏ', type: 'xa' }
    ]
  },
  {
    id: 'p-vl',
    name: 'Vĩnh Long',
    wards: [
      { id: 'w-vl-01', name: 'Phường 1 Vĩnh Long', type: 'phuong' },
      { id: 'w-vl-02', name: 'Phường 4 Vĩnh Long', type: 'phuong' },
      { id: 'w-vl-03', name: 'Phường 9 Vĩnh Long', type: 'phuong' },
      { id: 'w-vl-04', name: 'Phường Bình Minh', type: 'phuong' },
      { id: 'w-vl-05', name: 'Xã Long Hồ', type: 'xa' },
      { id: 'w-vl-06', name: 'Xã Mang Thít', type: 'xa' },
      { id: 'w-vl-07', name: 'Xã Tam Bình', type: 'xa' },
      { id: 'w-vl-08', name: 'Xã Trà Ôn', type: 'xa' },
      { id: 'w-vl-09', name: 'Xã Vũng Liêm', type: 'xa' }
    ]
  },
  {
    id: 'p-dt',
    name: 'Đồng Tháp',
    wards: [
      { id: 'w-dt-01', name: 'Phường 1 Cao Lãnh', type: 'phuong' },
      { id: 'w-dt-02', name: 'Phường 2 Cao Lãnh', type: 'phuong' },
      { id: 'w-dt-03', name: 'Phường Mỹ Phú', type: 'phuong' },
      { id: 'w-dt-04', name: 'Phường Sa Đéc', type: 'phuong' },
      { id: 'w-dt-05', name: 'Phường An Hòa', type: 'phuong' },
      { id: 'w-dt-06', name: 'Xã Hồng Ngự', type: 'xa' },
      { id: 'w-dt-07', name: 'Xã Lấp Vò', type: 'xa' },
      { id: 'w-dt-08', name: 'Xã Châu Thành', type: 'xa' },
      { id: 'w-dt-09', name: 'Xã Lai Vung', type: 'xa' },
      { id: 'w-dt-10', name: 'Xã Tháp Mười', type: 'xa' }
    ]
  },
  {
    id: 'p-cm',
    name: 'Cà Mau',
    wards: [
      { id: 'w-cm-01', name: 'Phường 1 Cà Mau', type: 'phuong' },
      { id: 'w-cm-02', name: 'Phường 5 Cà Mau', type: 'phuong' },
      { id: 'w-cm-03', name: 'Phường 9 Cà Mau', type: 'phuong' },
      { id: 'w-cm-04', name: 'Phường Tân Xuyên', type: 'phuong' },
      { id: 'w-cm-05', name: 'Xã Năm Căn', type: 'xa' },
      { id: 'w-cm-06', name: 'Xã Đất Mũi', type: 'xa' },
      { id: 'w-cm-07', name: 'Xã Trần Văn Thời', type: 'xa' },
      { id: 'w-cm-08', name: 'Xã U Minh', type: 'xa' },
      { id: 'w-cm-09', name: 'Xã Cái Nước', type: 'xa' },
      { id: 'w-cm-10', name: 'Xã Ngọc Hiển', type: 'xa' }
    ]
  },
  {
    id: 'p-ag',
    name: 'An Giang',
    wards: [
      { id: 'w-ag-01', name: 'Phường Mỹ Long', type: 'phuong' },
      { id: 'w-ag-02', name: 'Phường Mỹ Bình', type: 'phuong' },
      { id: 'w-ag-03', name: 'Phường Bình Khánh', type: 'phuong' },
      { id: 'w-ag-04', name: 'Phường Châu Đốc', type: 'phuong' },
      { id: 'w-ag-05', name: 'Phường Tân Châu', type: 'phuong' },
      { id: 'w-ag-06', name: 'Xã Thoại Sơn', type: 'xa' },
      { id: 'w-ag-07', name: 'Xã Chợ Mới', type: 'xa' },
      { id: 'w-ag-08', name: 'Xã Phú Tân', type: 'xa' },
      { id: 'w-ag-09', name: 'Xã Tri Tôn', type: 'xa' },
      { id: 'w-ag-10', name: 'Xã Tịnh Biên', type: 'xa' }
    ]
  }
];

// Helper mapping for legacy LOCATION_DATA structure so old components do not break
export const LOCATION_DATA: Province[] = ADMINISTRATIVE_PROVINCES.map((ap) => ({
  name: ap.name,
  districts: [
    {
      name: 'Toàn khu vực',
      wards: ap.wards.map((w) => w.name)
    }
  ]
}));
