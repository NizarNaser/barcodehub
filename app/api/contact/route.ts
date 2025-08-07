import emailjs from '@emailjs/browser';

const sendEmail = async () => {
  try {
    const result = await emailjs.send(
      'service_aaf0uep', // service ID
      'template_j2p4tdj', // template ID
      {
        name: "نزار",
        message: "هذه تجربة إرسال رسالة عبر EmailJS",
        time: new Date().toLocaleString("ar-EG"),
      },
      'YKBJv8TqbDo7iEUwr' // المفتاح العام
    );

    console.log('تم الإرسال:', result.text);
    alert("تم إرسال الرسالة بنجاح!");
  } catch (error) {
    console.error('خطأ:', error);
    alert("حدث خطأ أثناء الإرسال.");
  }
};
