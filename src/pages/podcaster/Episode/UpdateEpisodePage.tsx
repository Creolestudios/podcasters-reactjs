import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import ButtonWrapper from '../../../components/form/ButtonWrapper';

const UpdateEpisodePage: FC = () => {
  const navigate = useNavigate();

  const onViewTranscript = () => {
    const obj = {
      transcriptData: 'cuál es la fecha de tu cumpleaños qq',
      s3Url: 'podcast-episodes/202310090514030YPH1U0AMIT295N2II.wav',
    };
    navigate('/podcaster/123/555/edit/a5bd07fe-7faf-11ee-aa7e-3868935dacff', {
      state: obj,
    });
  };

  return (
    <div>
      <p>Episode Edit Page..</p>
      <ButtonWrapper onClick={onViewTranscript}>View Transcript</ButtonWrapper>
    </div>
  );
};

export default UpdateEpisodePage;
