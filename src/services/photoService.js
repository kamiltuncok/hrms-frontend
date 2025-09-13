
import axios from "axios"

export default class PhotoService{
    getPhotos(){
        return axios.get("http://localhost:8080/api/photos/getall");
    }

    static add(photo){
        return axios.post("http://localhost:8080/api/photos/add",photo);
    }

    static updatePhoto(photoId, formData) {
        return axios.put(`http://localhost:8080/api/photos/updatephoto/${photoId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Fotoğraf yüklemek için gerekli header
          },
        });
      }
}