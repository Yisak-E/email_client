import {M3Box} from "m3r";
import ListView from "../Views/LIstView";




export default function MailLayout() {
    return (
        <M3Box sx={{ p: 2 }}>
            Mail Layout
            <ListView />
        </M3Box>
    );
}