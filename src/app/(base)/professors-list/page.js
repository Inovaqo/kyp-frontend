import ProfessorsListFilter from '../../../components/ProfessorsListFilter';
import {Suspense} from 'react';

export default function page(){

  return<>
    <section>
      <div className="px-120 py-40 tablet-px-90 tablet-px-50 mobile-px-20">
        <Suspense>
          <ProfessorsListFilter />
        </Suspense>
      </div>
    </section>
  </>
}
