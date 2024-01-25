require('dotenv').config()
const express=require('express');
const nodemailer=require('nodemailer');
const cors=require('cors');

const app=express();
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.HOST;
    if (allowedOrigins===origin) {
      callback(null, true);
    } else {
      callback(false);
    }
  },
};
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ORG_EMAIL,
        pass: process.env.ORG_PWD,
    },
});

app.use(express.json());
app.use(cors(corsOptions));

const success={msg: 'Email sent successfully'};
const failure={msg: 'Error sending email!'};

const sendMail=async(peer_name,peer_email,peer_subject,peer_msg)=>{
    try{
        //for host of server
        const mailOptions1={
            from: process.env.ORG_EMAIL,
            to: process.env.HOST_EMAIL,
            subject: `Contact from ${peer_email}`,
            text: `
                Name: ${peer_name}
                Email: ${peer_email}
                Subject: ${peer_subject}
                Message: ${peer_msg}
            `
        }
        await transporter.sendMail(mailOptions1);
        //for the person contacting
        // const mailOptions2={
        //     from: process.env.ORG_EMAIL,
        //     to: "singhayangs6@gmail.com",
        //     subject: `Contact from ${peer_email}`,
        //     text: `
        //         Name: ${peer_name}
        //         Email: ${peer_email}
        //         Subject: ${peer_subject}
        //         Message: ${peer_msg}
        //     `
        // }
        // await transporter.sendMail(mailOptions2);
        console.log(success);
        return success;
    }catch(err){
        console.log(err);
        console.log(failure);
        return failure;
    }
}

const sendEmergency=async(peer_name,peer_email,peer_subject,peer_msg)=>{
    try{
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
        console.log(success);
        return success;
    }catch(err){
        console.log(err);
        console.log(failure);
        return failure;
    }
}
app.use((req,res,next)=>{
    const origin=req.get('Origin');
    console.log("Origin: ",origin);
    if(origin===process.env.HOST){
        next();
    }else{
        sendEmergency(
          'Hackers',
          process.env.HOST_EMAIL,
          'Emergency',
          `Some unauthorized person used your api on another host i.e ${origin}!`
        );
        res.send(success);
    }
});


app.post('/',async(req,res)=>{
    if(req.body.password && (req.body.password).length){
        res.send(success);
    }
    else if(req.body.name && req.body.mail && !req.body.password){
        const response=await sendMail(req.body.name,req.body.mail,req.body.subject,req.body.msg);
        res.send({msg: response});
    }
    else{
        console.log("Fields Empty");
        res.send({msg: "Fields Empty!"});
    }
});

app.listen(process.env.PORT||4000,()=>{
    console.log('Server Started');
});
