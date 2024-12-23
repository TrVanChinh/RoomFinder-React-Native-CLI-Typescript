import { IAddress } from "./address.interface";
import IUser from "./user.interface";

export interface IRoomType {
    maLoaiPhong: number;
    loaiPhong: string;
    phiDichVu: number;
  }

export interface IInterior {
    maNoiThat: number;
    dieuHoa: boolean;
    wifi: boolean;
    nongLanh: boolean;
    giuong: boolean;
    banGhe: boolean;
    sofa: boolean;
    chanGaGoi: boolean;
    tuLanh: boolean;
    doDungBep: boolean;
    tuQuanAo: boolean;
  }


export interface IRoom {
    maPhong: number| null;
    maNguoiDung: number;
    maLoaiPhong: number;
    maDiaChi: number;
    maNoiThat: number;
    tieuDe: string ;
    moTa: string;
    giaPhong: number;
    giaDien: number;
    giaNuoc: number;
    dienTich: string;
    phongChungChu: boolean;
    gacXep: boolean;
    nhaBep: boolean;
    soLuongPhongNgu: number;
    soTang: number;
    soNguoiToiDa: number;
    trangThaiPhong: string;
}

export interface IDeposit {
    maPhiDatCoc: number;
    maPhong: number;
    phiDatCoc: number;
    thoiHanDatCoc: number;
    donViThoiGian: string;
}

export interface MediaFormat {
  maHinhAnh: number;
  danhMucHinhAnh: string;
  loaiTep: string;
  duongDan: string;
}

export interface RoomInfo {
    maPhong: number;
    nguoiDung: IUser | null;
    loaiPhong: IRoomType;
    diaChi: IAddress;
    noiThat: IInterior;
    tieuDe: string ;
    chiPhiDatCoc: IDeposit[];
    hinhAnh: MediaFormat[];
    moTa: string;
    giaPhong: number;
    giaDien: number;
    giaNuoc: number;
    dienTich: string;
    phongChungChu: boolean;
    gacXep: boolean;
    nhaBep: boolean;
    soLuongPhongNgu: number;
    soTang: number;
    soNguoiToiDa: number;
    trangThaiPhong: string;
  }
