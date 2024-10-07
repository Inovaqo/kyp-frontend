import Link from 'next/link';
import ResetPasswordForm from '../../../../components/auth/ResetPasswordForm';
export default function page({ params }){

  return<>
    <div className="bg-ffffff px-40 py-20 border-radius-8" style={{width:'467px'}}>
      <h2 className="text-24 text-1F1F1F text-weight-500 mb-2">Reset your password</h2>
      <p className="text-434343 text-16 text-weight-400 mb-4">Enter a new password to reset the password on your account. Password must be 6 to 20 character long.</p>
      <ResetPasswordForm/>
      <div className="flex column items-center">
        <p className="text-weight-400 text-14 text-262626 mt-3">Keep your Password? &nbsp;
          <Link href="/login" className="text-14 text-weight-400 text-0378A6 text-decoration-none">
            Login
          </Link>
        </p>
      </div>

    </div>
  </>
}

