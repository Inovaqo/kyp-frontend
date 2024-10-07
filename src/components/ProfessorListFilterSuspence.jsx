import {Suspense} from 'react';
import ProfessorsListFilter from "@/components/ProfessorsListFilter";
export default function ProfessorsListFilterSuspence(){

    return<>
                <Suspense>
                    <ProfessorsListFilter />
                </Suspense>
    </>
}