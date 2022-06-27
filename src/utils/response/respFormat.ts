export default (data: any, message: string, status: boolean = false) => {
  return { response: data, message, status };
};
