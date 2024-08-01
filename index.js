/*
File: index.js
Author: raiyan (mra.alfikri@gmail.com)
Date: 1-8-2024 (1 Aug 2024)
*/

// load
document.addEventListener("DOMContentLoaded", () => {
  // ambil semua elemen.
  const passwordDisplay = document.getElementById("generated-password");
  const copyButton = document.getElementById("copy-password");
  const generateButton = document.getElementById("generate-password");
  const lengthInput = document.getElementById("password-length");
  const lengthValue = document.getElementById("length-value");
  const lowercaseCheckbox = document.getElementById("lowercase");
  const uppercaseCheckbox = document.getElementById("uppercase");
  const numbersCheckbox = document.getElementById("numbers");
  const symbolsCheckbox = document.getElementById("symbols");
  const excludeSimilarCheckbox = document.getElementById("exclude-similar");
  const excludeAmbiguousCheckbox = document.getElementById("exclude-ambiguous");
  const strengthMeter = document.getElementById("strength-meter");
  const strengthText = document.getElementById("strength-text");

  const updateStrengthMeter = (password) => {
    const strength = calculatePasswordStrength(password);
    strengthMeter.value = strength;
    strengthText.textContent = getStrengthLabel(strength);
  };

  // fungsi mencari keamanan password
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 10;
    if (password.length >= 12) strength += 20;
    if (password.length >= 16) strength += 10;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,}$/.test(
        password
      )
    )
      strength += 10;
    return Math.min(strength, 100);
  };

  const getStrengthLabel = (strength) => {
    if (strength < 30) return "Lemah";
    if (strength < 60) return "Sedang";
    if (strength < 80) return "Kuat";
    return "Sangat Kuat";
  };

  const generatePassword = () => {
    const length = parseInt(lengthInput.value);
    const useLower = lowercaseCheckbox.checked;
    const useUpper = uppercaseCheckbox.checked;
    const useNumbers = numbersCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;
    const excludeSimilar = excludeSimilarCheckbox.checked;
    const excludeAmbiguous = excludeAmbiguousCheckbox.checked;

    let chars = "";
    if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNumbers) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Del yang mirip jika dipilih
    if (excludeSimilar) {
      chars = chars.replace(/[ilLI|`oO0]/g, "");
    }
    // Del ambigu jika dipilih
    if (excludeAmbiguous) {
      chars = chars.replace(/[{}[]()\/\\'"~,;:.<>]/g, "");
    }

    // HARUS! satu jenis karakter
    if (chars === "") {
      alert("Pilih setidaknya satu jenis karakter.");
      return;
    }

    // buat password panjang yg udh ditentukan
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    // tampil password + indikator
    passwordDisplay.value = password;
    updateStrengthMeter(password);
  };

  generateButton.addEventListener("click", generatePassword);

  copyButton.addEventListener("click", () => {
    passwordDisplay.select();
    document.execCommand("copy");
    alert("Password berhasil disalin!");
  });

  lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
    if (passwordDisplay.value) {
      generatePassword();
    }
  });

  // ganti" password pas opsi password diubah"
  [
    lowercaseCheckbox,
    uppercaseCheckbox,
    numbersCheckbox,
    symbolsCheckbox,
    excludeSimilarCheckbox,
    excludeAmbiguousCheckbox,
  ].forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (passwordDisplay.value) {
        generatePassword();
      }
    });
  });

  generatePassword();
});
