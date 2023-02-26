function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        //let DNI = document.getElementById('DNI').value;
        let DNInum = document.getElementById('DNInum').value;
        let nombre = document.getElementById('nombre').value;
        let tracking = document.getElementById('tracking').value;
        //let DNIa = document.getElementById('DNIa').value;
        let DNIanum = document.getElementById('DNIanum').value;
        let nombrea = document.getElementById('nombrea').value;




        generatePDF(DNInum, nombre, tracking, DNIanum, nombrea);
    })

});

async function generatePDF(DNInum, nombre, tracking, DNIanum, nombrea) {
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
    //pdf.text(DNI, 170, 213);
    pdf.text(DNInum, 95, 277); //DNInum
    pdf.text(nombre, 65, 254); //nombre
    pdf.text(tracking, 148, 359);//tracking
    //pdf.text(DNIa, 170, 213);
    pdf.text(DNIanum, 160, 331);//DNIanum
    pdf.text(nombrea, 100, 303);//nombrea
    

    pdf.save("autorizacion.pdf");

}

function sendEmail(email, pdfData) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "h8charter@gmail.com",
            pass: "correos8"
        }
    });

    const mailOptions = {
        from: "h8charter@gmail.com",
        to: h8charter@gmail.com,
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
