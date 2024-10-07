import {Suspense} from "react";
import User from "@/components/user/User";
export default function page() {

  return<>
    <Suspense >
      <User/>
    </Suspense>
  </>
}
