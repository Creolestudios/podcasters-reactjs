import React, { FC, ReactNode } from 'react';
import { Formik, Form } from 'formik';
import ButtonWrapper from '../form/ButtonWrapper';

interface IButton {
  className: string;
  children: ReactNode | string;
  isDisabled?: boolean;
  isHide?: boolean;
}

interface IProps {
  initialValues: any;
  validationSchema: any;
  onSubmit: CallableFunction;
  children: ReactNode | Array<ReactNode>;
  button: IButton;
  validate?: any;
}

const FormikWrapper: FC<IProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  button,
  validate,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={(data) => onSubmit(data)}
    validate={validate}
    enableReinitialize
  >
    {() => (
      <Form>
        {children}

        {!button.isHide && (
          <ButtonWrapper
            type='submit'
            className={button.className}
            isDisabled={button.isDisabled}
          >
            {button.children}
          </ButtonWrapper>
        )}
      </Form>
    )}
  </Formik>
);

FormikWrapper.defaultProps = {
  validate: () => ({}),
};

export default FormikWrapper;
