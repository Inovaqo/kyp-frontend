import Image from 'next/image';

export default function Footer() {
  return <>
    <footer >
      <div className="px-80 py-40 mobile-px-20">
        <div className="flex items-center column">
          <Image className="mb-46"  height={54} width={108} src="/KYP.png" alt="KYPIcon"/>
          <div className="flex mb-40">
            <Image className="mr-24" height={46} width={46} src="/facebookIcon.png" alt="facebookIcon"/>
            <Image className="mr-24" height={46} width={46} src="/instagramIcon.png" alt="instagramIcon"/>
            <Image className="mr-24" height={46} width={46} src="/twitterIcon.png" alt="twitterIcon"/>
            <Image className="mr-24" height={46} width={46} src="/linkedinIcon.png" alt="linkedinIcon"/>
          </div>
        </div>
        <div className="full-width">
          <div className="separator-x mb-32"></div>
          <div className="flex justify-between professor-profile-mobile-center">
            <div >
            <p className="text-16 text-weight-400 text-262626">© 2024 Rate Know Your Professor, LLC. All Rights Reserved</p>
            </div>
            <div className="flex mobile-justify-center mobile-py-20">
              <p className="mr-24 text-16 text-weight-400 text-262626">Terms of Service</p>
              <p className="text-16 text-weight-400 text-262626">Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </>
}
