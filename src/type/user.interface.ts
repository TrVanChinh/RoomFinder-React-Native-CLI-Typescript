export default interface IUser {
    maNguoiDung: number;
    tenNguoiDung: string;
    gioiTinh: string | null;
    queQuan: string | null;
    email: string;
    matKhau: string;
    sdt: string | null;
    diaChi: string | null;
    hinhDaiDien: string | null;
    ngaySinh: Date | null;
    soCCCD: string | null;
    maTruocCCCD: string | null;
    maSauCCCD: string | null;
    maPX: string | null;
    maLTK: number | null;
    trangThaiDangKy: string;
    trangThaiTaiKhoan: string | null;
    ngayDangKy: Date;
    ngayCapNhat: Date | null;
  }