export default async function(req,res){
    const usertext=req.body.usertext;
    const response=await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${process.env.GROQ_API_KEY}`
            },
            body:JSON.stringify({
                model:"openai/gpt-oss-120b",
                messages: [
                    {
                        role:"system",
                        content:`You are an AI teacher explaining a user his acadmic doubt`
                    },
                    {
                        role:"user",
                        content: usertext
                    }
                ]
            })
        });
    const data=await response.json();
    res.status(200).json(data);
    console.log("Chatbot exists:", !!process.env.GROQ_API_KEY);
    console.log("Chatbot length:", process.env.GROQ_API_KEY?.length);
}