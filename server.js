require('dotenv').config()
const express=require('express');
const nodemailer=require('nodemailer');
const cors=require('cors');

const app=express();
app.use(express.json());
const corsOptions={
    origin: process.env.HOST,
    optionSuccessStatus: 200,
};

const sendMail=async(peer_name,peer_email,peer_subject,peer_msg)=>{
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.ORG_EMAIL,
                pass: process.env.ORG_PWD,
            },
        });
        const mailOptions={
            from: process.env.ORG_EMAIL,
            to: "singhayangs6@gmail.com",
            subject: `Contact from ${peer_email}`,
            text: `
                Name: ${peer_name}
                Email: ${peer_email}
                Subject: ${peer_subject}
                Message: ${peer_msg}
            `
        }
        await transporter.sendMail(mailOptions);
        return "Email sent successfully";
    }catch(err){
        console.log(err);
        return "Error sending email !";
    }
}

app.post('/',cors(corsOptions),async(req,res)=>{
    console.log('red');
    if(req.body.name && req.body.mail){
        const response=await sendMail(req.body.name,req.body.mail,req.body.subject,req.body.msg);
        res.send({msg: response});
    }
    else{
        res.send({msg: "Fields Empty!"});
    }
});

app.listen(process.env.PORT||4000,()=>{
    console.log('Server Started');
});
