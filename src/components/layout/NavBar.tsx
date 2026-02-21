import { M3Box, M3Typography, M3TextField } from "m3r";
import { MdMoreVert } from "react-icons/md";
import { useEmailContext } from "../../contexts/EmailContext";

const NavBar = () => {
	const {  accountEmail, accountName } = useEmailContext();
	const displayName = accountName || (accountEmail ? accountEmail.split('@')[0] : 'Account');
	const displayEmail = accountEmail || '';

	return (
		<M3Box className="top-bar">
			<M3Box className="top-bar-left">
				<M3Typography variant="titleMedium">Simple-Client</M3Typography>
			<M3Box className="account-row">
				<M3Box className="account-meta">
				<M3Typography variant="labelLarge" className="account-name">
					{displayName}
				</M3Typography>
				{displayEmail && (
					<M3Typography variant="labelSmall" className="account-email">
					{displayEmail}
					</M3Typography>
				)}
				</M3Box>
      </M3Box>
			</M3Box>
			<M3Box className="top-bar-right">
				<M3TextField
					placeholder="Global Search"
					size="small"
					className="top-search"
					fullWidth
				/>
				<M3Box className="top-bar-menu" aria-label="More options">
					<MdMoreVert size={20} />
				</M3Box>
			</M3Box>
		</M3Box>
	);
};

export default NavBar;
