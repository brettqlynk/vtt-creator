import * as React from 'react';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import debounce from 'lodash.debounce';
import { CuePropType } from '../services/vtt.service';
import TimingInput from './timing-input.component';

const useStyles = makeStyles({
	header: {
		backgroundColor: 'white',
	},
	headerEnd: {},
	closeIcon: {
		padding: 8,
		marginLeft: -4,
	},
});

CueEditor.propTypes = {
	cue: CuePropType.isRequired,
	onChange: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default function CueEditor({ cue, onChange, onDelete }) {
	const classes = useStyles();
	const [text, setText] = React.useState(cue.text);

	const debouncedOnChangeText = React.useCallback(
		debounce(text => onChange(new VTTCue(cue.startTime, cue.endTime, text)), 400),
		[cue, onChange]
	);

	React.useEffect(() => {
		setText(cue.text);
		return debouncedOnChangeText.flush;
	}, [cue.text]);

	const onChangeText = e => {
		setText(e.target.value);
		debouncedOnChangeText(e.target.value);
	};

	const onChangeStartTime = e => {
		const startTime = parseFloat(e.target.value);
		const offset = startTime - cue.startTime;
		onChange(new VTTCue(startTime, cue.endTime + offset, cue.text));
	};

	const onChangeEndTime = e => {
		onChange(new VTTCue(cue.startTime, parseFloat(e.target.value), cue.text));
	};

	const onChangeTimeSpan = e => {
		onChange(new VTTCue(cue.startTime, cue.startTime + parseFloat(e.target.value), cue.text));
	};

	return (
		<Grid container spacing={2}>
			<Grid container item alignItems="center" spacing={1} wrap="nowrap" justify="space-between">
				<Grid item>
					<TimingInput variant="outlined" label="Start Time" value={cue.startTime} onChange={onChangeStartTime} />
				</Grid>
				<Grid item>
					<TimingInput
						variant="outlined"
						label="Show For"
						value={cue.endTime - cue.startTime}
						onChange={onChangeTimeSpan}
					/>
				</Grid>
				<Grid item>
					<TimingInput variant="outlined" label="End Time" value={cue.endTime} onChange={onChangeEndTime} />
				</Grid>
				<Grid item className={classes.headerEnd}>
					<IconButton aria-label="Delete" onClick={onDelete} className={classes.closeIcon} edge="end">
						<CloseIcon fontSize="small" />
					</IconButton>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<TextField
					variant="outlined"
					fullWidth
					multiline
					rows="2"
					label="Caption text"
					value={text}
					onChange={onChangeText}
					onBlur={debouncedOnChangeText.flush}
					placeholder="Enter your caption here..."
				/>
			</Grid>
		</Grid>
	);
}
