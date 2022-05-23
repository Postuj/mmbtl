import Rating, { IconContainerProps } from '@mui/material/Rating';
import React, { FC, SyntheticEvent, useState } from 'react';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Box from '@mui/material/Box';
import styled from '@emotion/styled';

type OnRateChangeFunction = (score: number) => void;

type RateMemeFieldProps = {
  value: number;
  onRateChange: OnRateChangeFunction;
};

const MemeRating = styled(Rating)({
  '& .MuiRating-iconEmpty': {
    color: '#263238',
  },
  '& .MuiRating-iconFilled': {
    color: '#42B883',
  },
  '& .MuiRating-iconHover': {
    color: '#42B883',
  },
});

const reactionIconStyle = {
  fontSize: 60,
};

const reactionIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon style={reactionIconStyle} />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon style={reactionIconStyle} />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon style={reactionIconStyle} />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon style={reactionIconStyle} />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon style={reactionIconStyle} />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{reactionIcons[value].icon}</span>;
}

const RateMemeField: FC<RateMemeFieldProps> = ({ value, onRateChange }) => {
  const [score, setScore] = useState(value);

  const handleChange = (_: React.SyntheticEvent, newScore: number | null) => {
    if (!newScore) return;
    setScore(newScore);
    onRateChange(newScore);
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <MemeRating
        name="meme-rating"
        value={score}
        onChange={handleChange}
        IconContainerComponent={IconContainer}
      />
    </Box>
  );
};

export default RateMemeField;
