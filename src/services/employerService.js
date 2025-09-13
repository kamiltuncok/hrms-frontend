import axios from "axios";

export default class EmployerService {
  // Tüm employer'ları al
  getEmployers() {
    return axios.get("http://localhost:8080/api/employers/getall");
  }

  // Yeni employer ekle
  add(employer) {
    return axios.post("http://localhost:8080/api/employers/add", employer);
  }

  // UserId'ye göre employer'ı al
  static getEmployerByUserId(userId) {
    return axios.get(`http://localhost:8080/api/employers/getemployerbyuserid?userId=${userId}`);
  }

  // EmployerService.js
  static updatePhoto(employerId, formData) {
    return axios.post(`http://localhost:8080/api/employers/updatephoto/${employerId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Fotoğraf yüklemek için gerekli header
      },
    });
  }



  // Fotoğraf URL'ini oluştur
  static getEmployerPhotoUrl(photoUrl) {
    if (photoUrl) {
      return `http://localhost:8080/uploads/${photoUrl}`; // Burada doğru URL'yi döndürüyoruz
    }
    return "https://via.placeholder.com/150"; // Fotoğraf yoksa placeholder resmini döndürüyoruz
  }

  static changePassword(employerId, currentPassword, newPassword) {
    return axios.put(
      `http://localhost:8080/api/employers/changepassword/${employerId}`,
      {
        currentPassword,
        newPassword
      }
    );
  }

  static updateCompanyName(employerId, companyName) {
    return axios.put(`http://localhost:8080/api/employers/updatecompanyname/${employerId}`, {
      companyName,
    });
  }

  // Web adresini güncelle
  static updateWebAddress(employerId, webAdress) {
    return axios.put(`http://localhost:8080/api/employers/updatewebaddress/${employerId}`, {
      webAdress,
    });
  }

  // Şirket telefon numarasını güncelle
  static updatePhoneNumber(employerId, phoneNumber) {
    return axios.put(`http://localhost:8080/api/employers/updatephonenumber/${employerId}`, {
      phoneNumber,
    });
  }

  static getEmployerByEmployerId(employerId) {
  return axios.get(`http://localhost:8080/api/employers/getemployerbyemployerid?employerId=${employerId}`);
}

}
