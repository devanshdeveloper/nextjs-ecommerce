const ContactUs = () => {
  return (
    <div className="flex justify-center">
      <div className="w-[min(80vw,900px)]">
        <h1 className="text-2xl font-bold my-4">Contact Us</h1>
        <p className="my-2">
          If you have any questions or need further assistance, please contact
          us:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${process.env.EMAIL_USER}`}
              className="hover:underline"
              target="_blank"
            >
              {process.env.EMAIL_USER}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUs;
