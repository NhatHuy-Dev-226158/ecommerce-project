import axios from "axios";

/**
 * @file api.js
 * @description Tập hợp các hàm tiện ích để tương tác với API backend.
 */

// Lấy URL của API từ biến môi trường
const apiUrl = import.meta.env.VITE_API_URL;

//================================================================================
// HELPER FUNCTION
//================================================================================

// Hàm tiện ích để xử lý và chuẩn hóa lỗi từ các cuộc gọi API
const handleError = (error) => {
    console.error('API Error:', error);
    // Trả về lỗi có cấu trúc từ server nếu có
    if (error.response && error.response.data) {
        return error.response.data;
    }
    // Trả về lỗi chung nếu là lỗi mạng hoặc lỗi khác
    return { success: false, error: true, message: error.message || 'Đã có lỗi không xác định xảy ra.' };
}


//================================================================================
// EXPORTED API FUNCTIONS
//================================================================================

/**
 * @function postData
 * @description Gửi yêu cầu POST với dữ liệu JSON.
 * @param {string} url - Endpoint của API.
 * @param {object} jsonData - Dữ liệu cần gửi đi (dạng object).
 * @returns {Promise<object>} - Promise trả về phản hồi từ server.
 */
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

/**
 * @function fetchDataFromApi
 * @description Gửi yêu cầu GET để lấy dữ liệu.
 * @param {string} url - Endpoint của API.
 * @returns {Promise<object>} - Promise trả về phản hồi từ server.
 */
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
        return data;
    } catch (error) {
        return handleError(error);
    }
}

/**
 * @function uploadFiles
 * @description Gửi yêu cầu POST để tải lên file(s) (sử dụng FormData).
 * @param {string} url - Endpoint của API.
 * @param {FormData} formData - Đối tượng FormData chứa các file cần tải lên.
 * @returns {Promise<object>} - Promise trả về phản hồi từ server.
 */
export const uploadFiles = async (url, formData) => {
    try {
        const token = localStorage.getItem('accesstoken');
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // 'Content-Type' được trình duyệt tự động thiết lập cho FormData
            },
            body: formData
        });
        return await response.json();
    } catch (error) {
        return handleError(error);
    }
};

/**
 * @function uploadImage
 * @description Gửi yêu cầu PUT để tải lên một ảnh (sử dụng FormData).
 * @param {string} url - Endpoint của API.
 * @param {FormData} updateData - Đối tượng FormData chứa ảnh.
 * @returns {Promise<object>} - Promise trả về phản hồi từ server (axios response).
 */
export const uploadImage = async (url, updateData) => {
    const params = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
            'Content-Type': 'multipart/form-data',
        },
    };

    var response;
    // Ghi chú: Cấu trúc `await...then()` này có thể được đơn giản hóa,
    // nhưng vẫn giữ nguyên để không thay đổi logic gốc.
    await axios.put(apiUrl + url, updateData, params).then((res) => {
        response = res;
    })
    return response;
}

/**
 * @function updateData
 * @description Gửi yêu cầu PUT để cập nhật dữ liệu (dạng JSON).
 * @param {string} url - Endpoint của API.
 * @param {object} dataToUpdate - Dữ liệu cần cập nhật.
 * @returns {Promise<object>} - Promise trả về phản hồi từ server.
 */
export const updateData = async (url, dataToUpdate) => {
    const token = localStorage.getItem('accesstoken');
    const response = await fetch(apiUrl + url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate)
    });
    return response.json();
};

/**
 * @function deleteData
 * @description Gửi yêu cầu DELETE để xóa dữ liệu.
 * @param {string} url - Endpoint của API.
 * @returns {Promise<object>} - Promise trả về phản hồi từ server.
 */
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