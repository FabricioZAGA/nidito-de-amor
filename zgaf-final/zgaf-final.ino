#include <NewPing.h>

#define TRIGGER_PIN 11
#define ECHO_PIN 10
#define MAX_DISTANCE 200
#define LED 12
long acum = 0;
unsigned char Muestras = 100;
unsigned char Muestra = 0;
long cm = 0;
long cmTemp = 0;
long pwm = 0;
char BUZZER = A0;
//boton
const int buttonPin = 52;  
int buttonState = 1;  


//variables matriz

String statusLight = "off";
unsigned char infrarrojo = 13;
unsigned int password = 1234;
unsigned int pwd = 0;
unsigned int temporal;
unsigned char filas[] = {2, 3, 4, 5};
unsigned char columnas[] = {6, 7, 8, 9};
unsigned char tecla = 1;
bool b_serial = false;
bool b_presionado = false;
unsigned char teclaTemporal = 0;

// NewPing setup of pins and maximum distance

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

void salidas(unsigned char valor)
{
    unsigned char cociente = valor;
    unsigned char residuo = 0;
    for (unsigned int i = sizeof(filas); i > 0; i--)
    {
        residuo = cociente % 2;
        cociente = (cociente - residuo) / 2;
        if (residuo == 1)
            digitalWrite(filas[i - 1], HIGH);
        else
            digitalWrite(filas[i - 1], LOW);
    }
}

unsigned char entradas()
{
    unsigned char valor = 0;
    if (digitalRead(columnas[3]))
    {
        valor += 1;
    }
    if (digitalRead(columnas[2]))
    {
        valor += 2;
    }
    if (digitalRead(columnas[1]))
    {
        valor += 4;
    }
    if (digitalRead(columnas[0]))
    {

        valor += 8;
    }
    return valor;
}

unsigned char teclado(void)
{
    unsigned char car;
    salidas(0b1110);
    car = entradas();
    switch (car)
    {
    case 0b1110:
        return 'D';
        break;
    case 0b1101:
        return '#';
        break;
    case 0b1011:
        return '0';
        break;
    case 0b0111:
        return '*';
        break;
    }
    salidas(0b1101);
    car = entradas();
    switch (car)
    {
    case 0b1110:
        return 'C';
        //15 , 0x0F , 0b1111

        break;
    case 0b1101:
        return '9';
        break;
    case 0b1011:
        return '8';
        break;
    case 0b0111:
        return '7';
        break;
    }
    salidas(0b1011);
    car = entradas();
    switch (car)
    {
    case 0b1110:
        return 'B';
        break;
    case 0b1101:
        return '6';
        break;
    case 0b1011:
        return '5';
        break;
    case 0b0111:
        return '4';
        break;
    }
    salidas(0b0111);
    car = entradas();
    switch (car)
    {

    case 0b1110:
        return 'A';
        break;
    case 0b1101:
        return '3';
        break;
    case 0b1011:
        return '2';
        break;
    case 0b0111:
        return '1';
        break;
    }
    return 1;
}

//funciones
void ultrasonico()
{
    if (Muestra < Muestras)
    {
        acum += sonar.ping_cm();
        Muestra++;
    }
    else
    {
        cmTemp = acum / Muestras;
        acum = 0;
        Muestra = 0;
        if (cmTemp > 30)
        {
            cmTemp = 30;
        }
        else if (cmTemp < 2)
        {
            cmTemp = 2;
        }
    }
    if (cmTemp != cm)
    {
        cm = cmTemp;
        pwm = ((18 - (cm - 2)) * 255) / 18;
        // Serial.print(cm);
        // Serial.println(" cm"); // Serial.print("pwm ");
        String tempString = String("sens" + String(cm));

        Serial.print(tempString);
        Serial.write(10);
        analogWrite(LED, pwm);
    }
}

void tecladoMatricial()
{
    tecla = teclado();
    if (tecla != 1)
    {
        b_presionado = true;
        teclaTemporal = tecla;
    }
    else
    {
        if (b_presionado)
        {
            b_presionado = false;
            b_serial = true;

            tecla = teclaTemporal;
        }
    }
    if (b_serial)
    {
        b_serial = false;
        if (tecla >= '0' && tecla <= '9')
        {
            if (pwd < 9999)
            {
                pwd *= 10;
                pwd += (tecla - 48);
            }
            Serial.print(pwd);
            Serial.write(10);
        }
        else
        {
            switch (tecla)
            {
            case 'A':
                pwd = 0;
                Serial.print("ok");
                Serial.write(10);
                break;
            }
        }
    }
    if (Serial.available() > 0)
    {
        statusLight = Serial.readStringUntil('\n');
        delay(300);
        if (statusLight == "on")
        {
            digitalWrite(10, HIGH);
            pwd = 0;
        }
        else
        {
            digitalWrite(10, LOW);
            pwd = 0;
        }
    }
}

void buzzer(){
 buttonState = digitalRead(buttonPin);
 String tempString = String("ring" + String(buttonState));

 int zaga = buttonState ? 0 : 255; 
 analogWrite(BUZZER,zaga);
}

void setup()
{
  pinMode(BUZZER,0);
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(9600);
    pinMode(LED, OUTPUT);

    for (unsigned char i = 0; i < sizeof(columnas); i++)
    {
        pinMode(columnas[i], INPUT_PULLUP);
    }
    for (unsigned char i = 0; i < sizeof(filas); i++)
    {
        pinMode(filas[i], OUTPUT);
    }
}



void loop()
{
    buzzer();
    ultrasonico();
    tecladoMatricial();
}
