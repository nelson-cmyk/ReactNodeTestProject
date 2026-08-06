import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import DraftList from "./DraftList";
import SubmittedList from "./SubmittedList";


function HousingPage(){

const [tab,setTab]=useState("new");


return (

<div>

<h2>Housing Assistance</h2>


<button onClick={()=>setTab("new")}>
New Application
</button>


<button onClick={()=>setTab("draft")}>
Drafts
</button>


<button onClick={()=>setTab("submitted")}>
Submitted
</button>


<hr/>


{
tab==="new" &&
<ApplicationForm/>
}


{
tab==="draft" &&
<DraftList workflowId={1}/>
}


{
tab==="submitted" &&
<SubmittedList workflowId={1}/>
}


</div>

);

}


export default HousingPage;