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

// === HÀM POST DATA ===
export const postData = async (url, jsonData) => {
    try {
        const token = localStorage.getItem("accesstoken");
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        });
        return await response.json();
    } catch (error) {
        return handleError(error);
    }
}


// === HÀM GET DATA ===
export const fetchDataFromApi = async (url) => {
    try {
        const token = localStorage.getItem('accesstoken');

        // console.log("TOKEN GỬI ĐI TRONG HEADER:", token);

        const params = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.get(apiUrl + url, params);
        return data;
    } catch (error) {
        return handleError(error);
    }
}

// === HÀM UPLOAD ẢNH DANH MỤC ===
export const uploadFiles = async (url, formData) => {
    try {
        const token = localStorage.getItem('accesstoken');
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return await response.json();
    } catch (error) {
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