// TODO: implement it based on MSEditor Gallery

// TODO: add tests
export const Footer = ({
  selectImage,
}: {
  selectImage: (() => void) | null;
}) => {
  const selectImageProps = selectImage
    ? {
        onClick: selectImage,
      }
    : {
        disabled: true,
      };
  return (
    <div className="dp-image-gallery-footer">
      {/*
      TODO: add upload button
    */}
      <button
        type="button"
        {...selectImageProps}
        className="dp-button button-medium primary-green"
      >
        Select Image
      </button>
    </div>
  );
};