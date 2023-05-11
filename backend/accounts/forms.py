from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model


User = get_user_model()

# Create your forms here.

class NewUserForm(UserCreationForm):
    email = forms.EmailField(label='email', required=True)
    name = forms.CharField(max_length=30, required=True)
    password1 = forms.CharField(label='password', widget=forms.PasswordInput)
    password2 = forms.CharField(label="password confirmation", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['email', 'name', 'password1']


    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        curr_email = User.objects.filter(email=email)
        if curr_email.exists():
            raise forms.ValidationError("Account exists with this email")
        return email

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("password1") is not None and cleaned.get("password1") != cleaned.get("password2"):
            self.add_error("Password2", "Passwords do not match")
        return cleaned

    def save(self, commit=True):
        user = User.objects.create_user(
            self.cleaned_data["name"],
            self.cleaned_data["email"],
            self.cleaned_data['password1'],
        )
        return user
    
class LoginForm(forms.Form):
    email = forms.EmailField(label="email", required=True)
    password = forms.CharField(label="password", widget=forms.PasswordInput)
