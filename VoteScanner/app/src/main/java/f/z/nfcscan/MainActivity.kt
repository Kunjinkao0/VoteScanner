package f.z.nfcscan

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<Button>(R.id.reader).setOnClickListener {
            startActivity(Intent(this, ReaderActivity::class.java))
        }
        findViewById<Button>(R.id.controller).setOnClickListener {
            startActivity(Intent(this, ControllerActivity::class.java))
        }
    }
}