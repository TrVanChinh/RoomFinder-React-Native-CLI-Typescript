export const mapData = (res: any) => res.data;
export const mapError = (err: any) => {
  console.error('API Error:', err);
  return err.response?.data || 'Unknown error occurred';
};
