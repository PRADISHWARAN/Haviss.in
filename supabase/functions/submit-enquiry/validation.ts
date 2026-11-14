export const allowedServices = ['CMM Retrofit','CMM Calibration','CMM Repair','CMM Software Upgrade','CMM Inspection','CMM AMC','Used CMM Purchase','CMM Training','Modular Fixtures','Other Enquiry'];
export function validateFields(data: FormData) {
  const read = (key: string, min: number, max: number) => {
    const value = data.get(key);
    if (typeof value !== 'string') throw new Error(`Please provide ${key.replaceAll('_',' ')}.`);
    const clean = value.trim();
    if (clean.length < min || clean.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(clean)) throw new Error(`Please check ${key.replaceAll('_',' ')}.`);
    return clean;
  };
  const email = read('email',5,254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  const phone = read('phone',7,25);
  if (!/^[+0-9()\s-]+$/.test(phone) || phone.replace(/\D/g,'').length < 7) throw new Error('Please enter a valid phone number.');
  const service = read('service',1,100);
  if (!allowedServices.includes(service)) throw new Error('Please select a listed service.');
  if (data.get('consent') !== 'true') throw new Error('Please agree to the privacy notice.');
  const id = read('request_id',36,36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new Error('Please reload the form and try again.');
  return { id, full_name: read('full_name',2,100), company_name: read('company_name',2,150), email, phone, city: read('city',2,100), service, manufacturer: read('manufacturer',0,100), model: read('model',0,100), requirement: read('requirement',20,5000), product: read('product',0,200) };
}
export function validateAttachment(bytes: Uint8Array, type: string, name: string) {
  if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new Error('Attachments must be no larger than 5 MB.');
  const pdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = [137,80,78,71,13,10,26,10].every((value,index) => bytes[index] === value);
  if (type === 'application/pdf' && /\.pdf$/i.test(name) && pdf) return 'pdf';
  if (type === 'image/jpeg' && /\.jpe?g$/i.test(name) && jpeg) return 'jpg';
  if (type === 'image/png' && /\.png$/i.test(name) && png) return 'png';
  throw new Error('Upload a valid PDF, JPG or PNG file.');
}
