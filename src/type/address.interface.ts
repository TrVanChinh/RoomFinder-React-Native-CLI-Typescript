export interface IAddress {
    maDiaChi: number;
    soNha: string;
    phuongXa: string;
    quanHuyen: string;
    tinhThanh: string;
    kinhDo: number | null;
    viDo: number | null;
  }

  export  interface address_components {
    long_name: string;
    short_name: string;
  }

  export  interface compound {
    commune: string;
    district: string;
    province: string;
  }

  export interface ResultMapApi {
    address: string;
    address_components: address_components[];
    compound: compound;
    formatted_address: string;
    geometry: object;
    name: string;
    place_id: string;
    plus_code: object;
    reference: string;
    types: string[];
  }
  
  
  export  interface ResponseAddress {
    results: ResultMapApi[];
    status: string;
  }