import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Card, Badge, FileAttachment, Button, Form, SafeAnchor } from '@ahaui/react';
import DropFileContainer from './DropFileContainer';
import dropzoneUploadSvg from '../assets/images/drop-zone-upload.svg';
import dropzoneUploadedSvg from '../assets/images/drop-zone-uploaded.svg';

interface FakeFile {
  name?: string | null;
}

interface PreSelectedBlob {
  blob: Blob;
  type: 'blob';
  name: string;
}

const FileType = {
  CSV: {
    extension: '.csv',
    MIMEType: 'text/comma-separated-values,text/csv,application/csv,application/excel,application/vnd.ms-excel,application/vnd.msexcel',
  },
};
const MAX_ALLOWED_FILE_SIZE = 20 * 1024 * 1024;

const acceptMIMETypesList = FileType.CSV.MIMEType.split(',');
const maxAllowedFileSizeMessage = `Attachment size exceeds the limit of ${MAX_ALLOWED_FILE_SIZE / 1024 / 1024}MB.`;

function FileTemplate ({
  texts = [],
  rootStep = '',
  noFileOptionText = '',
  exampleFileUrl,
  piiAnonymizerFileUrl = '',
  piiFileOSSupported = false,
  uploading = false,
  handleSubmitWithFile = () => {},
  handleSubmitWithoutFile = () => {},
  fakeFileName,
  preSelectedBlob,
}: {
  texts: string[],
  rootStep: string,
  noFileOptionText?: string,
  exampleFileUrl: string,
  piiAnonymizerFileUrl: string,
  piiFileOSSupported?: boolean,
  handleSubmitWithFile: (file: File | object) => void,
  handleSubmitWithoutFile: () => void,
  uploading?: boolean,
  fakeFileName?: string,
  preSelectedBlob?: PreSelectedBlob,
}) {
  const [file, setFile] = useState<FakeFile | File | PreSelectedBlob>({ name: undefined });
  const [error, setError] = useState<{file: null | string}>({ file: null });

  useEffect(() => {
    if (fakeFileName) {
      setFile({
        name: fakeFileName,
      });
    }
  }, [fakeFileName]);

  useEffect(() => {
    if (preSelectedBlob) {
      setFile(preSelectedBlob);
    }
  }, [preSelectedBlob]);

  const getBadgeText = (rootStep: string, currentStep: number) => {
    if (rootStep) {
      return `${rootStep}.${currentStep}`;
    }
    return currentStep;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(e.target?.files?.length)) {
      return;
    }

    if (!(e.target?.files?.length > 0)) {
      return;
    }

    const file: File = e.target.files[0];
    if (!acceptMIMETypesList.includes(file.type) && file.name.split('.').pop()?.toLowerCase() !== 'csv') {
      return;
    }
    if (file.size > MAX_ALLOWED_FILE_SIZE) {
      setError({ file: maxAllowedFileSizeMessage });
    } else {
      setError({ file: null });
    }
    setFile(e.target.files[0]);
  };
  const onDropFile = (files: File[]) => {
    if (files[0].size > MAX_ALLOWED_FILE_SIZE) {
      setError({ file: maxAllowedFileSizeMessage });
    } else {
      setError({ file: null });
    }
    setFile(files[0]);
  };

  const handleDownloadTemplateFile = () => {
    window.open(exampleFileUrl);
  };

  const handleDownloadPIIFile = () => {
    if (piiFileOSSupported) {
      window.open(piiAnonymizerFileUrl);
    }
  };

  const onSubmit = () => {
    handleSubmitWithFile(file);
  };

  const renderDropFileContainer = (file: File | FakeFile | PreSelectedBlob) => (
    <div className="u-flex u-flexColumn">
      {!file?.name && (
        <div className="u-marginBottomMedium u-flex">
          <div className="u-positionRelative u-marginRightSmall u-flexShrink-0">
            <img src={dropzoneUploadSvg} className="u-maxWidthFull" alt="" />
          </div>
          <div className="u-textGray u-text200" data-name="file-name">
            Drop your file here (.csv) or browse a file
          </div>
        </div>
      )}

      {file?.name && (
        <div className="u-marginBottomExtraSmall">
          <div className="u-positionRelative u-marginRightSmall u-flexShrink-0 u-textCenter">
            <img src={dropzoneUploadedSvg} className="u-maxWidthFull" alt="" />
          </div>
          <div className="u-textGray u-textCenter" data-name="file-name">
            <span className="u-textWordBreakAll u-text200">{file?.name}</span>
          </div>
        </div>
      )}

      <div className="u-textCenter">
        <Form.Group className="u-marginNone">
          <input
            className="u-hidden"
            type="file"
            id="submissionFile"
            onChange={onFileChange}
            accept={FileType.CSV.extension}
            disabled={uploading}
          />
          {!preSelectedBlob && !uploading && file?.name && (
            <label
              htmlFor="submissionFile"
              className="Button u-flexInline u-justifyContentCenter u-alignItemsCenter u-textDecorationNone u-roundedMedium u-backgroundTransparent hover:u-backgroundPrimaryLighter u-border u-borderPrimary hover:u-textDecorationNone Button--small u-cursorPointer u-text200 u-textPrimary hover:u-textPrimary"
              style={{
                width: 200,
              }}
            >
              <span className="u-text100 u-cursorPointer">
                Change file
              </span>
            </label>
          )}
          {!file?.name && (
            <Button
              as="label"
              htmlFor="submissionFile"
              variant="secondary"
            >
              BROWSE FILE...
            </Button>
          )}
        </Form.Group>
      </div>
    </div>
  );

  return (
    <Card className="u-paddingMedium u-positionRelative u-zIndexPositive">
      {texts.map(text => (
        <div className="u-marginBottomMedium u-text200" key={text}>{text}</div>
      ))}
      <div className="Grid Grid--smallGutter">
        <div className="u-sizeFull lg:u-size1of3">
          <div className="u-marginBottomMedium">
            <span className="u-marginRightExtraSmall">
              <Badge variant="primary_subtle">{getBadgeText(rootStep, 1)}</Badge>
            </span>
            <span className="u-text400">Download template</span>
          </div>
          <div
            className="u-marginBottomMedium u-positionRelative"
          >
            <FileAttachment
              fileType="spreadsheet"
              fileTypeLabel="CSV"
              fileName={exampleFileUrl.split('/').slice(-1)}
              closeButton={false}
              actionLeft={() => (
                <SafeAnchor
                  data-name="template-file"
                  className="hover:u-textDecorationNone u-block u-flexGrow1 u-textCenter u-paddingTiny"
                  onClick={handleDownloadTemplateFile}
                >
                  Download
                </SafeAnchor>
              )}
            />
          </div>
          <div className="u-marginBottomMedium u-textGray u-text200">
            Use this template to format your data for optimal performance.
          </div>
        </div>
        <div className="u-sizeFull lg:u-size1of3">
          <div className="u-marginBottomMedium">
            <span className="u-marginRightExtraSmall">
              <Badge variant="primary_subtle">{getBadgeText(rootStep, 2)}</Badge>
            </span>
            <span className="u-text400">Anonymize data</span>
          </div>
          <div
            className="u-marginBottomMedium u-positionRelative"
          >
            <FileAttachment
              fileType="spreadsheet"
              fileTypeLabel="APP"
              fileName={piiFileOSSupported ? piiAnonymizerFileUrl.split('/').slice(-1) : 'Your OS is not supported'}
              closeButton={false}
              actionLeft={() => (
                <SafeAnchor
                  data-name="pii-file"
                  className={classNames('hover:u-textDecorationNone u-block u-flexGrow1 u-textCenter u-paddingTiny',
                    !piiFileOSSupported && 'u-textGray u-cursorNotAllow',
                  )}
                  onClick={handleDownloadPIIFile}
                >
                  Download
                </SafeAnchor>
              )}
            />
          </div>
          <div className="u-marginBottomMedium u-textGray u-text200">
            Got sensitive data? We got you covered. Download our anonymizer app to obfuscate your data!
          </div>
        </div>
        <div
          className="u-sizeFull lg:u-size1of3 u-flex u-flexColumn"
          style={{
            minHeight: 250,
          }}
        >
          <div className="u-marginBottomMedium">
            <span className="u-marginRightExtraSmall">
              <Badge variant="primary_subtle">{getBadgeText(rootStep, 3)}</Badge>
            </span>
            <span className="u-text400">Upload file</span>
          </div>
          <div className="u-marginBottomExtraSmall">
            <DropFileContainer
              onDropFile={onDropFile}
              acceptMIMETypes={FileType.CSV.MIMEType}
              multiple
              disabled={uploading || !!preSelectedBlob}
            >
              {renderDropFileContainer(file)}
            </DropFileContainer>

            {error.file && (
              <Form.Feedback visible type="invalid">{error.file}</Form.Feedback>
            )}
          </div>
        </div>
      </div>
      <div className="u-paddingBottomSmall">
        <Button
          width="full"
          onClick={onSubmit}
          disabled={uploading || error.file}
          data-name="submit-btn"
        >
          <Button.Label>{uploading ? 'Submitting...' : 'Submit'}</Button.Label>
        </Button>
      </div>
      <div>
        {noFileOptionText && (
          <div
            className={`${uploading ? 'u-textGray' : 'u-cursorPointer u-textPrimary'} u-textCenter u-text300`}
            onClick={handleSubmitWithoutFile}
          >
            {noFileOptionText}
          </div>
        )}
      </div>
    </Card>
  );
}

export default FileTemplate;
