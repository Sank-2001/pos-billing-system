import java.util.Arrays;
import java.util.Date;

public class Main {
    public static void main(String[] args) {
            System.out.println("Hello World");

            for (int i = 1; i <=10; i++) {
                System.out.println("i =" +i);
            }
            byte myAge = 25;
            byte herAge = myAge;
            long viewsCount = 3_123_456_789L;
            float price = 52.99F;
            char letter = 'A';
            boolean isElligible = true;

            Date now = new Date();
            System.out.println( now);
            System.out.println(herAge + myAge);
            String message = "Hello \"World\"";
            System.out.println(message);
            String message2 = "c:\\windows\\";
            System.out.println(message2);
            String message3 = "c\n\\windows\\";
            System.out.println(message3);
            String message4 = "c:\tWindows\\";
            System.out.println(message4);

//            Arrays

//        int [] numbers = new int[5];
//        numbers[0] = 1;
//        numbers[1] = 2;
//
//        System.out.println(Arrays.toString(numbers));

        int [] numbers = {2 ,3 ,5 ,6 ,4 ,1};
        Arrays.sort(numbers);
        System.out.println(Arrays.toString((numbers)));

    }

}