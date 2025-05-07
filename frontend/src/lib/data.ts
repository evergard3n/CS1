export async function getShortenedUrl(targetUrl: string) : Promise<string> {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch(
            `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/create?url=${targetUrl}`,
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
        return data.id as string
    } catch (error) {
        console.error(error);
        return "https://www.google.com";
    }
}