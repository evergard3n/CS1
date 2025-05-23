export async function getShortenedUrl(targetUrl: string) : Promise<string> {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch(
            `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/create?url=${targetUrl}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );        
        const data = await response.json();
        console.log(data)
        // return data.url as string;
        return response as unknown as string
    } catch (error) {
        console.error(error);
        return "https://www.google.com";
    }
}