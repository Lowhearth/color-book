export async function generateImage(apiKey, onData) {
    // MOCK return data to not spam the API :)
    return onData({ data: [ { url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-FU2S4NeSphau0woaj0yJAt1s/user-mI5mnDVVzB2M18tDRoSxNnja/img-nvMEBpg57FGxNUFFvJoPXo1l.png?st=2023-11-11T18%3A30%3A16Z&se=2023-11-11T20%3A30%3A16Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-11T03%3A20%3A08Z&ske=2023-11-12T03%3A20%3A08Z&sks=b&skv=2021-08-06&sig=5l1dpJ%2BJy1PwCf6UfjF15Uz38NggdT540Cyr0onLDxg%3D"}]})
    // Ensure the API key is passed
    if (!apiKey) {
        throw new Error('OpenAI API key is required!');
    }

    // The fetch options including the method, headers, and body data
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: 'a photo of a happy corgi puppy sitting and facing forward, studio light, longshot',
            n: 1,
            size: '1024x1024',
        }),
    };

    // Perform the fetch call to the OpenAI API endpoint
    const response = await fetch('https://api.openai.com/v1/images/generations', fetchOptions)

    const generatedImageResponse = await response.json()
    
    onData(generatedImageResponse)
}