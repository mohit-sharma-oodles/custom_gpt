import React, { useEffect } from "react";
import styles from "./index.module.scss";
import { MdErrorOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  loading, // New prop
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <MdErrorOutline size={40} color="#ff4d4f" />
        <button className={styles.modalClose} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalBody}>
          <h2 style={{ fontWeight: "500" }}>
            {t("Deleting")} {title}!
          </h2>
          <p>
            {t("Are you sure you want to delete this")} {title}?
          </p>
          <div className={styles.modalActions}>
            <button
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading} // Disable cancel button during loading
            >
              {t("Cancel")}
            </button>
            <button
              className={styles.deleteBtn}
              onClick={onConfirm}
              disabled={loading} // Disable delete button during loading
            >
              {loading ? t("Deleting...") : t("Delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
