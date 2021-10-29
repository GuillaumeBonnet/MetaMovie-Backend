import { createTransport } from "nodemailer";
const sendResetPasswordEmail = async (
	email: string,
	resetPasswordUrl: string
) => {
	await sendEmail(
		email,
		`Your MetaMovie password reset request`,
		undefined,
		`
		<div
      style="
        tab-size: 4;
        -webkit-text-size-adjust: 100%;
        font-family: inherit;
        line-height: inherit;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
      "
    >
      <div
        style="
          tab-size: 4;
          -webkit-text-size-adjust: 100%;
          font-family: inherit;
          line-height: inherit;
          box-sizing: border-box;
          border-style: solid;
          --tw-shadow: 0 0 #0000;
          --tw-ring-inset: var(--tw-empty);
          --tw-ring-offset-width: 0px;
          --tw-ring-offset-color: #fff;
          --tw-ring-color: rgba(59, 130, 246, 0.5);
          --tw-ring-offset-shadow: 0 0 #0000;
          --tw-ring-shadow: 0 0 #0000;
          margin-top: 3rem;
          border-radius: 1rem;
          border-width: 4px;
          --tw-border-opacity: 1;
          border-color: rgba(209, 213, 219, var(--tw-border-opacity));
          --tw-bg-opacity: 1;
          background-color: rgba(31, 41, 55, var(--tw-bg-opacity));
          padding: 2.5rem;
          --tw-text-opacity: 1;
          color: rgba(255, 255, 255, var(--tw-text-opacity));
          max-width: 600px;
        "
      >
        <p
          style="
            tab-size: 4;
            -webkit-text-size-adjust: 100%;
            font-family: inherit;
            --tw-bg-opacity: 1;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            --tw-border-opacity: 1;
            border-color: rgba(229, 231, 235, var(--tw-border-opacity));
            --tw-shadow: 0 0 #0000;
            --tw-ring-inset: var(--tw-empty);
            --tw-ring-offset-width: 0px;
            --tw-ring-offset-color: #fff;
            --tw-ring-color: rgba(59, 130, 246, 0.5);
            --tw-ring-offset-shadow: 0 0 #0000;
            --tw-ring-shadow: 0 0 #0000;
            margin: 0;
            font-size: 1.5rem;
            line-height: 2rem;
          "
        >
          Hello ${email} ,
        </p>
        <p
          style="
            tab-size: 4;
            -webkit-text-size-adjust: 100%;
            font-family: inherit;
            line-height: inherit;
            --tw-bg-opacity: 1;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            --tw-border-opacity: 1;
            border-color: rgba(229, 231, 235, var(--tw-border-opacity));
            --tw-shadow: 0 0 #0000;
            --tw-ring-inset: var(--tw-empty);
            --tw-ring-offset-width: 0px;
            --tw-ring-offset-color: #fff;
            --tw-ring-color: rgba(59, 130, 246, 0.5);
            --tw-ring-offset-shadow: 0 0 #0000;
            --tw-ring-shadow: 0 0 #0000;
            margin: 0;
            margin-top: 2.5rem;
            font-weight: 700;
          "
        >
          A request has been received to change the password for your MetaMovie
          account.
        </p>
        <div
          style="
            tab-size: 4;
            -webkit-text-size-adjust: 100%;
            font-family: inherit;
            line-height: inherit;
            --tw-bg-opacity: 1;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            --tw-border-opacity: 1;
            border-color: rgba(229, 231, 235, var(--tw-border-opacity));
            --tw-shadow: 0 0 #0000;
            --tw-ring-inset: var(--tw-empty);
            --tw-ring-offset-width: 0px;
            --tw-ring-offset-color: #fff;
            --tw-ring-color: rgba(59, 130, 246, 0.5);
            --tw-ring-offset-shadow: 0 0 #0000;
            --tw-ring-shadow: 0 0 #0000;
            display: flex;
            justify-content: center;
            vertical-align: middle;
          "
        >
          <a
            href="${resetPasswordUrl}"
            style="
              tab-size: 4;
              -webkit-text-size-adjust: 100%;
              font-family: inherit;
              line-height: inherit;
              --tw-bg-opacity: 1;
              --tw-text-opacity: 1;
              box-sizing: border-box;
              border-width: 0;
              border-style: solid;
              --tw-border-opacity: 1;
              border-color: rgba(229, 231, 235, var(--tw-border-opacity));
              --tw-shadow: 0 0 #0000;
              --tw-ring-inset: var(--tw-empty);
              --tw-ring-offset-width: 0px;
              --tw-ring-offset-color: #fff;
              --tw-ring-color: rgba(59, 130, 246, 0.5);
              --tw-ring-offset-shadow: 0 0 #0000;
              --tw-ring-shadow: 0 0 #0000;
              color: inherit;
              text-decoration: inherit;
            "
          >
            <button
              style="
                tab-size: 4;
                -webkit-text-size-adjust: 100%;
                --tw-bg-opacity: 1;
                --tw-text-opacity: 1;
                box-sizing: border-box;
                border-style: solid;
                --tw-shadow: 0 0 #0000;
                --tw-ring-inset: var(--tw-empty);
                --tw-ring-offset-width: 0px;
                --tw-ring-offset-color: #fff;
                --tw-ring-color: rgba(59, 130, 246, 0.5);
                --tw-ring-offset-shadow: 0 0 #0000;
                --tw-ring-shadow: 0 0 #0000;
                font-family: inherit;
                margin: 0;
                text-transform: none;
                -webkit-appearance: button;
                background-image: none;
                cursor: pointer;
                color: inherit;
                border-radius: 0.375rem;
                border-width: 1px;
                --tw-border-opacity: 1;
                border-color: rgba(255, 255, 255, var(--tw-border-opacity));
                background-color: transparent;
                padding-left: 1rem;
                padding-right: 1rem;
                padding-top: 0.25rem;
                padding-bottom: 0.25rem;
                font-size: 1.25rem;
                line-height: 1.75rem;
              "
            >
              Reset Password
            </button>
          </a>
        </div>
        <p
          style="
            tab-size: 4;
            -webkit-text-size-adjust: 100%;
            font-family: inherit;
            line-height: inherit;
            --tw-bg-opacity: 1;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            --tw-border-opacity: 1;
            border-color: rgba(229, 231, 235, var(--tw-border-opacity));
            --tw-shadow: 0 0 #0000;
            --tw-ring-inset: var(--tw-empty);
            --tw-ring-offset-width: 0px;
            --tw-ring-offset-color: #fff;
            --tw-ring-color: rgba(59, 130, 246, 0.5);
            --tw-ring-offset-shadow: 0 0 #0000;
            --tw-ring-shadow: 0 0 #0000;
            margin: 0;
          "
        >
          Thank you,
        </p>
        <p
          style="
            tab-size: 4;
            -webkit-text-size-adjust: 100%;
            font-family: inherit;
            line-height: inherit;
            --tw-bg-opacity: 1;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            box-sizing: border-box;
            border-width: 0;
            border-style: solid;
            --tw-border-opacity: 1;
            border-color: rgba(229, 231, 235, var(--tw-border-opacity));
            --tw-shadow: 0 0 #0000;
            --tw-ring-inset: var(--tw-empty);
            --tw-ring-offset-width: 0px;
            --tw-ring-offset-color: #fff;
            --tw-ring-color: rgba(59, 130, 246, 0.5);
            --tw-ring-offset-shadow: 0 0 #0000;
            --tw-ring-shadow: 0 0 #0000;
            margin: 0;
          "
        >
          MetaMovie
        </p>
      </div>
    </div>
		`
	);
	// 	`Welcome to Meta Movie! Confirm Your Email`,
	// 	`
	// You're on your way!
	// Let's confirm your email address.
	// By clicking on the following link, you are confirming your email address.`
};
const sendEmail = async (
	email: string,
	subject: string,
	text?: string,
	html?: string
) => {
	try {
		const transporter = createTransport({
			host: process.env.EMAIL_HOST,
			secure: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
		const sendMailOption: Parameters<typeof transporter.sendMail>[0] = {
			from: process.env.EMAIL_FROM,
			to: email,
			subject: subject,
		};
		if (html) {
			sendMailOption.html = html;
		} else {
			sendMailOption.text = text;
		}
		await transporter.sendMail(sendMailOption);
		console.log("email sent sucessfully");
	} catch (error) {
		console.log("[error]", error);
		throw Error("Error email not sent");
	}
};
export { sendResetPasswordEmail };
