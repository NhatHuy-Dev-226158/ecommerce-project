import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Hàm chuẩn hóa lỗi để tái sử dụng
const handleError = (error) => {
    console.error('API Error:', error);
    // Nếu là lỗi từ axios, nó có thể có cấu trúc `error.response.data`
    if (error.response && error.response.data) {
        return error.response.data;
    }
    // Nếu là lỗi mạng hoặc lỗi khác
    return { success: false, error: true, message: error.message || 'An unknown error occurred.' };
}

// === HÀM POST DATA (SỬ DỤNG FETCH) ===
export const postData = async (url, formData) => {
    try {
        const token = localStorage.getItem("accesstoken");
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Luôn parse JSON, dù response thành công hay thất bại
        return await response.json();

    } catch (error) {
        // Trả về một đối tượng lỗi nhất quán
        return handleError(error);
    }
}

// === HÀM GET DATA (SỬ DỤNG AXIOS) ===
export const fetchDataFromApi = async (url) => {
    try {
        const token = localStorage.getItem('accesstoken');
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.get(apiUrl + url, params);
        return data; // `data` từ axios đã là đối tượng JSON
    } catch (error) {
        // Trả về một đối tượng lỗi nhất quán
        return handleError(error);
    }
}

// === HÀM UPLOAD ẢNH DANH MỤC (SỬ DỤNG FETCH) ===
export const uploadCategoryImages = async (url, formData) => {
    try {
        const token = localStorage.getItem('accesstoken');
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Không cần 'Content-Type' cho FormData
            },
            body: formData
        });
        return await response.json();
    } catch (error) {
        // Trả về một đối tượng lỗi nhất quán
        return handleError(error);
    }
};

export const uploadImage = async (url, updateData) => {
    const params = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'multipart/form-data',
        },
    };

    var response;
    await axios.put(apiUrl + url, updateData, params).then((res) => {
        response = res;
    })
    return response
}


export const updateData = async (url, dataToUpdate) => {
    const token = localStorage.getItem('accesstoken');
    const response = await fetch(apiUrl + url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
    });
    return response.json();
};

export const deleteData = async (url) => {
    const token = localStorage.getItem('accesstoken');
    const response = await fetch(apiUrl + url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};