import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import TextAreaWrapper from '../form/TextAreaWrapper';
import ButtonWrapper from '../form/ButtonWrapper';
import { showToastMessage } from '../../utils';
import { TOASTER_STATUS } from '../../constant';

interface IProps {
  src: string;
  width: number;
  height: number;
}

const EmbedCode: React.FC<IProps> = ({ src, width, height }) => {
  const embedCode = `<iframe src="${src}" width="${width}" height="${height}" frameborder="0"></iframe>`;
  return (
    <div>
      <TextAreaWrapper
        name='transcript'
        className='view-transcript-text'
        value={embedCode}
        onChange={() => {}}
        rows={4}
      />
      <CopyToClipboard
        text={embedCode}
        onCopy={() => {
          showToastMessage(TOASTER_STATUS.SUCCESS, 'Code Copied Successfully');
        }}
      >
        <ButtonWrapper className='w-100' onClick={() => {}}>
          Copy Code
        </ButtonWrapper>
      </CopyToClipboard>
    </div>
  );
};

export default EmbedCode;
