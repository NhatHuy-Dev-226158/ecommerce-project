import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            //console.log(data)
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

export const fetchDataFromApi = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.get(apiUrl + url, params)
        return data;
    } catch (error) {
        console.log(error);
        return error;
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