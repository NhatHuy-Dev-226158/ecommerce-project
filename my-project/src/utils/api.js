import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const handleError = (error) => {
    console.error('API Error:', error);
    if (error.response && error.response.data) {
        return error.response.data;
    }
    return { success: false, error: true, message: error.message || 'An unknown network error occurred.' };
}

export const fetchPublicDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(apiUrl + url);
        return data;
    } catch (error) {
        return handleError(error);
    }
}

export const fetchDataFromApi = async (url) => {
    try {
        const token = localStorage.getItem('accesstoken');
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // // --- LOG CHI TIẾT ---
        // console.groupCollapsed(`[API GET] ${url}`);
        // console.log("Token from localStorage:", token);
        // console.log("Headers sent:", params.headers);
        // console.groupEnd();
        // // -------------------

        const { data } = await axios.get(apiUrl + url, params);
        return data;
    } catch (error) {
        return handleError(error);
    }
}

export const postData = async (url, formData) => {
    try {
        const token = localStorage.getItem("accesstoken");
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // // --- LOG CHI TIẾT ---
        // console.groupCollapsed(`[API POST] ${url}`);
        // console.log("Token from localStorage:", token);
        // console.log("Headers sent:", headers);
        // console.groupEnd();
        // // -------------------

        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formData)
        });

        return await response.json();

    } catch (error) {
        return handleError(error);
    }
}

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