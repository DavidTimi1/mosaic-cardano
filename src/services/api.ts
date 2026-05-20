

// central api for making api calls
export const fetchAPI = async ({ url, method = 'GET', data, headers = {} }: { url: string, method?: string, data?: any, headers?: any }) => {
    try {
        const response = await fetch(url, { method, body: data, headers });
        return response.json();

    } catch (error) {
        console.error('Error fetching API:', error);
        return {error};
    }
}