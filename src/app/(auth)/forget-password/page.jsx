import Link from 'next/link';
import ForgetPasswordForm from '../../../components/auth/ForgetPasswordForm';
export default function page(){

  return<>
    <div className="bg-ffffff px-40 py-20 border-radius-8" style={{width:'467px'}}>
      <h2 className="text-24 text-1F1F1F text-weight-500 mb-2">Forgot Password?</h2>
      <p className="text-434343 text-16 text-weight-400 mb-4">Enter your registered email address to receive password reset instructions.</p>
      <ForgetPasswordForm/>
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

