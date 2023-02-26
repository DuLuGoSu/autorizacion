function sendEmail(email, pdfData) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "tu_correo@gmail.com",
            pass: "tu_contraseña"
        }
    });

    const mailOptions = {
        from: "tu_correo@gmail.com",
        to: email,
        subject: "PDF generado",
        attachments: [
            {
                filename: "autorizacion.pdf",
                content: pdfData
            }
        ]
    };

    return transporter.sendMail(mailOptions);
}

async function generatePDFAndSendEmail(DNInum, nombre, tracking, DNIanum, nombrea, email) {
    const image = await loadImage("formulario.jpg");
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('l', 'px', 'a4');
    pdf.setFont("arial");
    pdf.setFontType("bold");

    pdf.addImage(image, 'JPG', 37, 25, 555, 391);
    pdf.addImage(signatureImage, 'PNG', 335, 330, 300, 60);

    const date = new Date();
    pdf.text(date.toLocaleDateString(), 300, 230);
    pdf.text('FECHA:', 250, 230);

    pdf.setFontSize(18);
    pdf.text(DNInum, 95, 277); //DNInum
    pdf.text(nombre, 65, 254); //nombre
    pdf.text(tracking, 148, 359);//tracking
    pdf.text(DNIanum, 160, 331);//DNIanum
    pdf.text(nombrea, 100, 303);//nombrea

    const pdfData = pdf.output('arraybuffer');

    try {
        await sendEmail(email, pdfData);
        alert("Correo electrónico enviado correctamente");
    } catch (error) {
        console.error(error);
        alert("Error al enviar el correo electrónico");
    }
}

window.addEventListener('load', () => {
    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const DNInum = document.getElementById('DNInum').value;
        const nombre = document.getElementById('nombre').value;
        const tracking = document.getElementById('tracking').value;
        const DNIanum = document.getElementById('DNIanum').value;
        const nombrea = document.getElementById('nombrea').value;
        const email = document.getElementById('email').value;

        try {
            await generatePDFAndSendEmail(DNInum, nombre, tracking, DNIanum, nombrea, email);
        } catch (error) {
            console.error(error);
            alert("Error al generar el PDF y enviar el correo electrónico");
        }
    })
});
