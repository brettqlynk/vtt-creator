import * as React from 'react';
import * as PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useOverlay } from './overlay.context';
import useFileSelector from '../use-file-selector.hook';

VideoOptionsMenu.propTypes = {
	onFilesSelected: PropTypes.func.isRequired,
};

export default function VideoOptionsMenu({ onFilesSelected: outerOnFilesSelected }) {
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null);
	const { onShowOverlay, onStartOverlayTimeout } = useOverlay();

	const onOpenOptionsMenu = e => {
		setOptionsMenuAnchorEl(e.currentTarget);
		onShowOverlay();
	};

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null);
		onStartOverlayTimeout();
	};

	const onFilesSelected = e => {
		onCloseOptionsMenu();
		outerOnFilesSelected(e);
	};

	const onOpenFileSelector = useFileSelector({ accept: 'video/*', onFilesSelected });

	return (
		<React.Fragment>
			<IconButton color="inherit" aria-label="Video Options" onClick={onOpenOptionsMenu}>
				<MoreIcon />
			</IconButton>
			<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
				<MenuItem onClick={onOpenFileSelector}>Select New Video File...</MenuItem>
			</Menu>
		</React.Fragment>
	);
}